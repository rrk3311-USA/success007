import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 9000,
      host: process.env.HOST || "0.0.0.0",
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        // PayPal only: Medusa v2 has no official PayPal provider yet. Using built-in system
        // provider (manual/COD) until you add a custom PayPal provider. No Stripe.
        providers: [],
      },
    },
    {
      resolve: "@medusajs/medusa/translation",
    },
  ],
  featureFlags: {
    translation: true,
  },
})
