export const config = () => ({
    port: +process.env.PORT || 80,
    httpTimeout: +process.env.HTTP_TIMEOUT || 10000,
    httpMaxRedirects: +process.env.HTTP_MAX_REDIRECTS || 3,
    executionRetries: +process.env.EXECUTION_RETRIES || 2,
    executionBaseDelay: +process.env.EXECUTION_BASE_DELAY || 1000,

    siproadProductsHost: process.env.SIPROAD_PRODUCTS_HOST,
    siproadProductsApiKey: process.env.SIPROAD_PRODUCTS_API_KEY
  })