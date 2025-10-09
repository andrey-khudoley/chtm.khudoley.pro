// @shared
// biome-ignore lint/correctness/noUnusedImports: импорт обязателен для корректной обработки JSX на платформе Chatium
import { jsx } from "@app/html-jsx"
import PostsTable from './tables/posts.table'
import { getThumbnailUrl } from '@app/storage'

// Конвертация markdown в HTML, совместимую с Telegram Instant View
function markdownToHtml(content: string): string {
  if (!content) return ''

  const lines = content.split('\n')
  const htmlParts: string[] = []
  let cursor = 0

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

  const normaliseLink = (href: string) => {
    const trimmed = href.trim()
    if (!trimmed) {
      return '#'
    }
    if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
      return trimmed
    }
    if (trimmed.startsWith('//')) {
      return `https:${trimmed}`
    }
    return trimmed
  }

  const parseInline = (value: string) => {
    let result = escapeHtml(value)

    result = result.replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
    result = result.replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>')
    result = result.replace(/(?<!_)_(?!_)(.+?)_(?!_)/g, '<em>$1</em>')
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>')
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
      const safeHref = normaliseLink(href)
      return `<a href="${safeHref}" rel="noopener noreferrer nofollow">${text}</a>`
    })
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      const safeSrc = normaliseLink(src)
      const safeAlt = escapeHtml(alt)
      return `<img src="${safeSrc}" alt="${safeAlt}" loading="lazy" />`
    })

    return result
  }

  while (cursor < lines.length) {
    const rawLine = lines[cursor]
    const trimmedLine = rawLine.trim()

    if (!trimmedLine) {
      cursor++
      continue
    }

    const standaloneImage = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (standaloneImage) {
      const [, alt, src] = standaloneImage
      htmlParts.push(
        `<figure><img src="${normaliseLink(src)}" alt="${escapeHtml(alt)}" loading="lazy" /></figure>`
      )
      cursor++
      continue
    }

    if (trimmedLine.startsWith('```')) {
      const code: string[] = []
      cursor++
      while (cursor < lines.length && !lines[cursor].trim().startsWith('```')) {
        code.push(escapeHtml(lines[cursor]))
        cursor++
      }
      htmlParts.push(`<pre><code>${code.join('\n')}</code></pre>`)
      if (cursor < lines.length) {
        cursor++
      }
      continue
    }

    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      htmlParts.push(`<h${level}>${parseInline(text)}</h${level}>`)
      cursor++
      continue
    }

    if (/^[-*+]\s+/.test(trimmedLine)) {
      htmlParts.push('<ul>')
      while (cursor < lines.length && /^[-*+]\s+/.test(lines[cursor].trim())) {
        const item = lines[cursor].trim().replace(/^[-*+]\s+/, '')
        htmlParts.push(`<li>${parseInline(item)}</li>`)
        cursor++
      }
      htmlParts.push('</ul>')
      continue
    }

    if (/^\d+\.\s+/.test(trimmedLine)) {
      htmlParts.push('<ol>')
      while (cursor < lines.length && /^\d+\.\s+/.test(lines[cursor].trim())) {
        const item = lines[cursor].trim().replace(/^\d+\.\s+/, '')
        htmlParts.push(`<li>${parseInline(item)}</li>`)
        cursor++
      }
      htmlParts.push('</ol>')
      continue
    }

    if (trimmedLine.startsWith('> ')) {
      const quoteLines: string[] = []
      while (cursor < lines.length && lines[cursor].trim().startsWith('> ')) {
        quoteLines.push(`<p>${parseInline(lines[cursor].trim().slice(2))}</p>`)
        cursor++
      }
      htmlParts.push(`<blockquote>${quoteLines.join('')}</blockquote>`)
      continue
    }

    if (/^(---|\*\*\*|___)$/.test(trimmedLine)) {
      htmlParts.push('<hr />')
      cursor++
      continue
    }

    const paragraphChunks: string[] = []
    while (
      cursor < lines.length &&
      lines[cursor].trim() &&
      !lines[cursor].trim().match(/^(#{1,6}\s|[-*+]\s+|\d+\.\s+|```|>\s+|---|\*\*\*|___)$/)
    ) {
      paragraphChunks.push(lines[cursor].trim())
      cursor++
    }

    if (paragraphChunks.length) {
      htmlParts.push(`<p>${parseInline(paragraphChunks.join(' '))}</p>`)
    }
  }

  return htmlParts.join('\n')
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

  if (!post.published && (!ctx.user || !ctx.user.is('Admin'))) {
    return ctx.resp.notFound()
  }

  const BlogSettingsTable = (await import('./tables/blogsettings.table')).default
  const [authorSetting] = await BlogSettingsTable.findAll(ctx, {
    where: { key: 'blogAuthor' },
    limit: 1
  })
  const [titleSetting] = await BlogSettingsTable.findAll(ctx, {
    where: { key: 'blogTitle' },
    limit: 1
  })
  const blogTitle = titleSetting?.value || 'Название блога'
  const blogAuthor = authorSetting?.value || blogTitle

  const postExcerpt = post.excerpt || (post.content ? post.content.substring(0, 160) : '')
  const postImageUrl = post.coverImage ? getThumbnailUrl(ctx, post.coverImage, 1200, 630) : null

  const relativePostPath = miniPostRoute({ slug: post.slug }).url()
  const postUrl = ctx.account.url(relativePostPath)
  const absoluteImageUrl = postImageUrl
    ? /^https?:\/\//i.test(postImageUrl)
      ? postImageUrl
      : ctx.account.url(postImageUrl)
    : null

  const contentHtml = markdownToHtml(post.content || '')

  const publishDate = post.publishedAt || post.createdAt
  const publishDateISO = new Date(publishDate).toISOString()
  const publishDateReadable = new Date(publishDate).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const readingTime = post.readingTime && Number(post.readingTime) > 0 ? Number(post.readingTime) : null

  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <title>{post.title} - {blogTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content={postExcerpt || post.title} />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#2563eb" />

        <link rel="canonical" href={postUrl} />

        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={postExcerpt || post.title} />
        {absoluteImageUrl && <meta property="og:image" content={absoluteImageUrl} />}
        {absoluteImageUrl && <meta property="og:image:width" content="1200" />}
        {absoluteImageUrl && <meta property="og:image:height" content="630" />}
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={blogTitle} />
        {blogAuthor && <meta property="article:author" content={blogAuthor} />}
        {post.publishedAt && <meta property="article:published_time" content={new Date(post.publishedAt).toISOString()} />}
        {post.updatedAt && <meta property="article:modified_time" content={new Date(post.updatedAt).toISOString()} />}
        {post.tags?.split(',').map(tag => {
          const normalisedTag = tag.trim()
          if (!normalisedTag) {
            return null
          }
          return <meta key={normalisedTag} property="article:tag" content={normalisedTag} />
        })}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={postExcerpt || post.title} />
        {absoluteImageUrl && <meta name="twitter:image" content={absoluteImageUrl} />}

        <script src="https://telegram.org/js/telegram-web-app.js"></script>

        <style>{`
          :root {
            color-scheme: light dark;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--tg-theme-bg-color, #f8fafc);
            color: var(--tg-theme-text-color, #111827);
            line-height: 1.6;
          }

          a {
            color: var(--tg-theme-link-color, #1d4ed8);
            text-decoration: none;
          }

          a:hover,
          a:focus {
            text-decoration: underline;
          }

          img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            display: block;
          }

          figure {
            margin: 1.5rem 0;
          }

          figcaption {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 0.5rem;
          }

          header,
          footer,
          article,
          section {
            width: 100%;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            color: #0f172a;
            margin: 1.5rem 0 0.75rem;
            line-height: 1.3;
          }

          p {
            margin: 0 0 1rem;
            color: #1f2937;
          }

          ul,
          ol {
            margin: 1rem 0 1rem 1.5rem;
            padding: 0;
          }

          li {
            margin: 0.5rem 0;
            color: #1f2937;
          }

          blockquote {
            margin: 1.5rem 0;
            padding-left: 1rem;
            border-left: 4px solid #cbd5f5;
            color: #4b5563;
            font-style: italic;
          }

          code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
            background: rgba(15, 23, 42, 0.06);
            padding: 0.125rem 0.25rem;
            border-radius: 6px;
            font-size: 0.9em;
          }

          pre {
            background: rgba(15, 23, 42, 0.92);
            color: #f8fafc;
            padding: 1rem;
            border-radius: 12px;
            overflow-x: auto;
            margin: 1.5rem 0;
            white-space: pre-wrap;
            word-break: break-word;
          }

          pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
            color: inherit;
          }

          hr {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 2rem 0;
          }

          .page-wrapper {
            max-width: 720px;
            margin: 0 auto;
            padding: 1.5rem 1.25rem 2.5rem;
          }

          .meta {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            font-size: 0.9375rem;
            color: #4b5563;
          }

          .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            list-style: none;
            margin: 1.5rem 0 0;
            padding: 0;
          }

          .tag-list li {
            background: rgba(37, 99, 235, 0.12);
            color: #1d4ed8;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.8125rem;
          }

          .admin-note {
            background: #fef9c3;
            border: 1px solid #facc15;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
            color: #854d0e;
            font-size: 0.9375rem;
          }

          .telegram-safe-area {
            padding-bottom: env(safe-area-inset-bottom);
          }

          footer p {
            color: #6b7280;
            font-size: 0.875rem;
          }
        `}</style>

        <script>{`
          (function() {
            const applyTheme = theme => {
              if (!theme) return
              const root = document.documentElement
              Object.entries(theme).forEach(([key, value]) => {
                if (!value) return
                const cssVar = '--tg-theme-' + key.replace(/[A-Z]/g, match => '-' + match.toLowerCase())
                root.style.setProperty(cssVar, value)
              })
            }

            window.addEventListener('DOMContentLoaded', function() {
              if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
                return
              }

              const tg = Telegram.WebApp
              applyTheme(tg.themeParams)
              tg.expand()

              if (tg.setHeaderColor) {
                tg.setHeaderColor('secondary_bg_color')
              }
              if (tg.setBackgroundColor) {
                tg.setBackgroundColor('bg_color')
              }

              tg.onEvent('themeChanged', function() {
                applyTheme(tg.themeParams)
              })

              if (tg.BackButton) {
                tg.BackButton.onClick(function() {
                  tg.close()
                })
                tg.BackButton.show()
              }

              if (tg.MainButton) {
                tg.MainButton.setParams({ text: 'Закрыть', is_visible: false })
                tg.MainButton.onClick(function() {
                  tg.close()
                })
              }
            })
          })()
        `}</script>
      </head>
      <body class="telegram-safe-area">
        <article class="page-wrapper" itemScope itemType="https://schema.org/Article">
          <meta itemProp="headline" content={post.title} />
          <meta itemProp="description" content={postExcerpt || post.title} />
          <meta itemProp="datePublished" content={publishDateISO} />
          {post.updatedAt && <meta itemProp="dateModified" content={new Date(post.updatedAt).toISOString()} />}
          <meta itemProp="mainEntityOfPage" content={postUrl} />
          {absoluteImageUrl && <meta itemProp="image" content={absoluteImageUrl} />}

          {!post.published && ctx.user?.is('Admin') && (
            <div class="admin-note" role="note">
              <strong>Черновик:</strong> Этот материал пока не опубликован и виден только администраторам.
            </div>
          )}

          <header>
            {post.coverImage && (
              <figure>
                <img
                  src={getThumbnailUrl(ctx, post.coverImage, 800, 400)}
                  alt={post.title}
                  loading="lazy"
                />
                {post.excerpt && <figcaption>{post.excerpt}</figcaption>}
              </figure>
            )}

            <div class="meta">
              <time dateTime={publishDateISO} itemProp="datePublished">{publishDateReadable}</time>
              {post.updatedAt && (
                <time dateTime={new Date(post.updatedAt).toISOString()} itemProp="dateModified">
                  Обновлено: {new Date(post.updatedAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              {blogAuthor && (
                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                  Автор: <span itemProp="name">{blogAuthor}</span>
                </span>
              )}
              {readingTime && <span>Время чтения: {readingTime} мин</span>}
            </div>

            <h1 itemProp="headline">{post.title}</h1>

            {post.tags && (
              <ul class="tag-list" aria-label="Теги публикации">
                {post.tags.split(',').map((tag, index) => (
                  <li key={`${tag.trim()}-${index}`}>{tag.trim()}</li>
                ))}
              </ul>
            )}
          </header>

          <section class="article-content" itemProp="articleBody">
            <raw-html>{contentHtml}</raw-html>
          </section>

          <footer>
            <p>Спасибо, что дочитали до конца.</p>
          </footer>
        </article>
      </body>
    </html>
  )
})
