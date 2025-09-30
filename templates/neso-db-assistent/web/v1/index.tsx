import { jsx } from "@app/html-jsx";
import { Debug } from "./lib/debug";
import { initializeDebug } from "./lib/getLogLevel";

// Декларация типов для Vue файлов
declare module "*.vue";

import SettingsPage from "./pages/SettingsPage.vue";
import DefaultPage from "./pages/DefaultPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import CurrencyRatesPage from "./pages/CurrencyRatesPage.vue";

export const webV1Route = app.get('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/index]");
  Debug.info(ctx, 'Запрос к веб-интерфейсу');

  const view = req.query.view as string | undefined;
  const isSettings = req.query.settings === 'project';
  
  let pageName = 'по умолчанию';
  if (isSettings) pageName = 'настройки';
  else if (view === 'products') pageName = 'продукты';
  else if (view === 'currency-rates') pageName = 'курсы валют';
  
  Debug.info(ctx, `Отображение страницы: ${pageName}`);
  
  let PageComponent = DefaultPage;
  if (isSettings) PageComponent = SettingsPage;
  else if (view === 'products') PageComponent = ProductsPage;
  else if (view === 'currency-rates') PageComponent = CurrencyRatesPage;
  
  return (
    <html>
      <head>
        <title>Neso Assistant - Web Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/s/static/lib/tailwind.3.4.16.min.js"></script>
        <style type="text/tailwindcss">{`
          body {
            --color-primary: #3B82F6;
            --color-secondary: #1E40AF;
            --color-success: #10B981;
            --color-danger: #EF4444;
            --color-warning: #F59E0B;
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
          }
        `}</style>
      </head>
      <body class="bg-gray-100 min-h-screen">
        <PageComponent />
      </body>
    </html>
  );
});