import ProductsTable from "../../../tables/v1/products.table";
import { Debug } from "../../../lib/debug.lib";
import { initializeDebug } from "../../../lib/getLogLevel";

// @shared-route
export const getProductsRoute = app.get('/', async (ctx, req) => {
  await initializeDebug(ctx, "[NeSoAI/products]");
  Debug.info(ctx, 'Запрос на получение списка продуктов');

  try {
    const products = await ProductsTable.findAll(ctx, { 
      limit: 1000,
      order: [{ pid: 'asc' }]
    });
    
    Debug.info(ctx, `Найдено продуктов: ${products.length}`);
    return products;
  } catch (error) {
    Debug.error(ctx, `Ошибка при получении продуктов: ${error instanceof Error ? error.message : String(error)}`, 'E_GET_PRODUCTS');
    throw error;
  }
});

