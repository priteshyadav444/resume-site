import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    public: {
      apiUrl: process.env.BLOG_API_URL || 'http://localhost:4000/graphql',
      siteUrl: process.env.SITE_URL || 'https://priteshyadav444.in'
    }
  }
})
