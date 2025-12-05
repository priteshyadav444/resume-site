# Blog API (NestJS + GraphQL + SQLite)

Minimal NestJS GraphQL backend for the blog.

## Quick start

1. Install dependencies

```bash
cd services/blog-api
npm install
```

2. Run in dev mode (auto-reloads on changes)

```bash
npm run start:dev
```

3. Open GraphQL playground:

http://localhost:4000/graphql

Use queries like:

```
query Posts { posts { id title slug excerpt publishedAt } }

query Post($id: Int!) { postById(id: $id) { id title content } }

mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { id title } }
```

Notes:
- Data is stored in `services/blog-api/blog.sqlite` (auto-created).
- This is a minimal scaffold; for production use, add authentication, migrations, validation and environment variable configuration.

## Admin / Authentication

- The API includes a simple admin login mutation that returns a JWT. It's intentionally minimal (env-based credentials) for the scaffold.
- Environment variables:
	- `ADMIN_EMAIL` (default `admin@local`)
	- `ADMIN_PASSWORD` (default `admin123`)
	- `JWT_SECRET` (default `changeme`) — change before production.

Example login mutation (returns `accessToken`):

```graphql
mutation { loginAdmin(email:"admin@local", password:"admin123") { accessToken } }
```

Use the token in the `Authorization: Bearer <token>` header when calling protected mutations:

```graphql
mutation CreatePost($input: CreatePostInput!) { createPost(input:$input){ id title } }
```

Protected mutations: `createPost`, `updatePost`, `deletePost`.

Note: For production, wire a proper user table, hashed passwords, and stronger secrets.
