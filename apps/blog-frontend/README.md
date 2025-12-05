# Blog Frontend (Nuxt 3)

This is a minimal Nuxt 3 frontend that queries the NestJS GraphQL API.

## Setup

```bash
cd apps/blog-frontend
npm install
npm run dev
```

By default the GraphQL endpoint is `http://localhost:4000/graphql`. To change it set `BLOG_API_URL` in the environment or edit `nuxt.config.ts` runtime config.
