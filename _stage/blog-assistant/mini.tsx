// @shared
import { jsx } from "@app/html-jsx"
import PostsTable from './tables/posts.table'
import { getThumbnailUrl } from '@app/storage'

// Convert markdown to HTML string for Instant View compatibility
function markdownToHtml(content: string): string {
  if (!content) return ''
  
  const lines = content.split('\n')
  const htmlLines: string[] = []
  let i = 0
  
  // Helper to escape HTML
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  
  // Parse inline markdown
  const parseInline = (text: string): string => {
    let result = escapeHtml(text)
    
    // Bold: **text** or __text__
    result = result.replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
    
    // Italic: *text* or _text_
    result = result.replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>')
    result = result.replace(/(?<!_)_(?!_)(.+?)_(?!_)/g, '<em>$1</em>')
    
    // Code: `text`
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    
    return result
  }
  
  while (i < lines.length) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    if (!trimmedLine) {
      i++
      continue
    }
    
    // Code block
    if (trimmedLine.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      if (codeLines.length > 0) {
        htmlLines.push(`<pre><code>${codeLines.join('\n')}</code></pre>`)
      }
      i++
      continue
    }
    
    // Headers
    if (trimmedLine.startsWith('### ')) {
      htmlLines.push(`<h3>${parseInline(trimmedLine.substring(4))}</h3>`)
      i++
      continue
    } else if (trimmedLine.startsWith('## ')) {
      htmlLines.push(`<h2>${parseInline(trimmedLine.substring(3))}</h2>`)
      i++
      continue
    } else if (trimmedLine.startsWith('# ')) {
      htmlLines.push(`<h1>${parseInline(trimmedLine.substring(2))}</h1>`)
      i++
      continue
    }
    
    // Unordered list
    if (trimmedLine.match(/^[\-\*\+]\s+/)) {
      htmlLines.push('<ul>')
      while (i < lines.length && lines[i].trim().match(/^[\-\*\+]\s+/)) {
        const itemText = lines[i].trim().replace(/^[\-\*\+]\s+/, '')
        htmlLines.push(`<li>${parseInline(itemText)}</li>`)
        i++
      }
      htmlLines.push('</ul>')
      continue
    }
    
    // Ordered list
    if (trimmedLine.match(/^\d+\.\s+/)) {
      htmlLines.push('<ol>')
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, '')
        htmlLines.push(`<li>${parseInline(itemText)}</li>`)
        i++
      }
      htmlLines.push('</ol>')
      continue
    }
    
    // Blockquote
    if (trimmedLine.startsWith('> ')) {
      htmlLines.push('<blockquote>')
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        htmlLines.push(`<p>${parseInline(lines[i].trim().substring(2))}</p>`)
        i++
      }
      htmlLines.push('</blockquote>')
      continue
    }
    
    // Horizontal rule
    if (trimmedLine.match(/^(\-\-\-+|\*\*\*+|___+)$/)) {
      htmlLines.push('<hr />')
      i++
      continue
    }
    
    // Regular paragraph
    const paragraphLines: string[] = []
    while (i < lines.length && lines[i].trim() && 
           !lines[i].trim().match(/^(#{1,6}\s|[\-\*\+]\s+|\d+\.\s+|```|>\s+|(\-\-\-+|\*\*\*+|___+)$)/)) {
      paragraphLines.push(lines[i].trim())
      i++
    }
    
    if (paragraphLines.length > 0) {
      const paragraphText = paragraphLines.join(' ')
      htmlLines.push(`<p>${parseInline(paragraphText)}</p>`)
    }
  }
  
  return htmlLines.join('\n')
}

export const miniPostRoute = app.get('/:slug', async (ctx, req) => {
  const [post] = await PostsTable.findAll(ctx, {
    where: { 
      slug: req.params.slug
    },
    limit: 1
  })

  if (!post) {
    return ctx.resp.notFound()
  }

  // If post is not published, only admins can view it
  if (!post.published && (!ctx.user || !ctx.user.is('Admin'))) {
    return ctx.resp.notFound()
  }

  // Get blog settings for author
  const BlogSettingsTable = (await import('./tables/blogsettings.table')).default
  const [authorSetting] = await BlogSettingsTable.findAll(ctx, {
    where: { key: 'blogAuthor' },
    limit: 1
  })
  const blogAuthor = authorSetting?.value || 'Название блога'

  const postExcerpt = post.excerpt || (post.content ? post.content.substring(0, 160) : '')
  const postImageUrl = post.coverImage ? getThumbnailUrl(ctx, post.coverImage, 1200, 630) : null
  
  // Build absolute URLs for Open Graph
  const baseUrl = `https://${ctx.req.headers.host}`
  const postUrl = `${baseUrl}${miniPostRoute({ slug: post.slug }).url()}`
  const absoluteImageUrl = postImageUrl ? `${baseUrl}${postImageUrl}` : null

  // Convert markdown to HTML for Instant View compatibility
  const contentHtml = markdownToHtml(post.content || '')
  
  // Format date for datetime attribute
  const publishDate = post.publishedAt || post.createdAt
  const publishDateISO = new Date(publishDate).toISOString()
  const publishDateReadable = new Date(publishDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <html>
      <head>
        <title>{post.title} - Название блога</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content={postExcerpt || post.title} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={postUrl} />
        
        {/* Open Graph meta tags for Telegram Instant View */}
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={postExcerpt || post.title} />
        {absoluteImageUrl && <meta property="og:image" content={absoluteImageUrl} />}
        {absoluteImageUrl && <meta property="og:image:width" content="1200" />}
        {absoluteImageUrl && <meta property="og:image:height" content="630" />}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Название блога" />
        {blogAuthor && <meta property="article:author" content={blogAuthor} />}
        {post.publishedAt && <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />}
        {post.tags && post.tags.split(',').map(tag => <meta property="article:tag" content={tag.trim()} />)}
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={postExcerpt || post.title} />
        {absoluteImageUrl && <meta name="twitter:image" content={absoluteImageUrl} />}
        
        {/* Telegram Mini App SDK */}
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        
        <script src="/s/static/lib/tailwind.3.4.16.min.js"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="/s/static/lib/fontawesome/6.7.2/css/all.min.css" rel="stylesheet" />
        
        <style type="text/tailwindcss">{`
          body {
            --color-primary: #2563eb;
            --color-dark: #111827;
            --font-sans: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .tg-theme {
            background-color: var(--tg-theme-bg-color, #ffffff);
            color: var(--tg-theme-text-color, #000000);
          }
          
          .prose {
            max-width: none;
          }
          
          .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            color: var(--color-dark);
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .prose h1 { font-size: 1.875rem; line-height: 2.25rem; }
          .prose h2 { font-size: 1.5rem; line-height: 2rem; }
          .prose h3 { font-size: 1.25rem; line-height: 1.75rem; }
          
          .prose p {
            color: #4b5563;
            line-height: 1.7;
            margin-bottom: 1rem;
          }
          
          .prose a {
            color: var(--color-primary);
            text-decoration: none;
          }
          
          .prose a:hover {
            text-decoration: underline;
          }
          
          .prose code {
            background: #f1f5f9;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
          
          .prose pre {
            background: #1e293b;
            color: #f1f5f9;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          
          .prose ul, .prose ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }
          
          .prose li {
            margin: 0.5rem 0;
            color: #4b5563;
          }
          
          /* Telegram-specific styles */
          .telegram-safe-area {
            padding-bottom: env(safe-area-inset-bottom);
          }
        `}</style>
        
        <script>{`
          // Initialize Telegram Mini App
          let isTelegramMiniApp = false;
          
          window.addEventListener('DOMContentLoaded', async function() {
            if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
              isTelegramMiniApp = true;
              const tg = Telegram.WebApp;
              
              // Expand to full height
              tg.expand();
              
              // Set header color
              tg.setHeaderColor('#ffffff');
              tg.setBackgroundColor('#f9fafb');
              
              // Enable closing confirmation
              tg.enableClosingConfirmation();
              
              // Request write access (permission to send messages)
              try {
                if (tg.requestWriteAccess) {
                  const result = await tg.requestWriteAccess();
                  console.log('Write access result:', result);
                }
              } catch (error) {
                console.error('Error requesting write access:', error);
              }
              
              // Apply Telegram theme
              document.body.classList.add('tg-theme');
              
              // Show the main button if needed
              if (tg.MainButton) {
                tg.MainButton.setText('Закрыть');
                tg.MainButton.onClick(function() {
                  tg.close();
                });
                // tg.MainButton.show(); // Uncomment if needed
              }
              
              // Handle back button
              if (tg.BackButton) {
                tg.BackButton.onClick(function() {
                  tg.close();
                });
                tg.BackButton.show();
              }
            }
          });
        `}</script>
      </head>
      <body class="bg-gray-50 min-h-screen telegram-safe-area">
        <article class="max-w-4xl mx-auto px-4 py-6">
          {/* Unpublished Warning for Admins */}
          {!post.published && ctx.user?.is('Admin') && (
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6 rounded">
              <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-yellow-400 mr-2"></i>
                <p class="text-yellow-800 text-sm font-medium">Этот пост не опубликован</p>
              </div>
            </div>
          )}
          
          {/* Post Header */}
          <header class="mb-6">
            {/* Cover Image - Instant View compatible */}
            {post.coverImage && (
              <figure class="mb-6">
                <img 
                  src={getThumbnailUrl(ctx, post.coverImage, 800, 400)}
                  alt={post.title}
                  class="w-full h-48 object-cover rounded-lg shadow-md"
                />
                {post.excerpt && <figcaption class="sr-only">{post.excerpt}</figcaption>}
              </figure>
            )}

            {/* Post Meta - Instant View compatible */}
            <div class="flex items-center justify-between mb-4 text-sm text-gray-500">
              <div class="flex flex-col space-y-1">
                <time datetime={publishDateISO} class="text-gray-600">{publishDateReadable}</time>
                {blogAuthor && <address class="author not-italic text-gray-600">Автор: {blogAuthor}</address>}
              </div>
              <div class="flex items-center space-x-2">
                <span>
                  <i class="fas fa-clock mr-1"></i>
                  {post.readingTime || 1} мин
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && (
              <div class="flex flex-wrap gap-2 mb-6">
                {post.tags.split(',').map(tag => (
                  <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content - Instant View compatible */}
          <div class="prose prose-lg max-w-none">
            <raw-html>{contentHtml}</raw-html>
          </div>

          {/* Post Footer */}
          <footer class="mt-8 pt-6 border-t border-gray-200">
            <div class="text-center text-gray-600 text-sm">
              <p>Спасибо за чтение!</p>
            </div>
          </footer>
        </article>
      </body>
    </html>
  )
})