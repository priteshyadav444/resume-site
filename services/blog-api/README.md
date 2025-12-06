# Blog API (NestJS + GraphQL + REST + PostgreSQL)

NestJS backend with GraphQL and REST API endpoints for blog, portfolio, and menu management.

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

## Database Setup

1. **Create PostgreSQL Database**

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE db_name;

# Create user (if needed)
CREATE USER pritesh WITH PASSWORD 'pritesh';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE db_name TO pritesh;
```

2. **Configure Environment Variables**

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
ADMIN_DB_HOST=localhost
ADMIN_DB_PORT=5432
ADMIN_DB_DATABASE=db_name
ADMIN_DB_USERNAME=pritesh
ADMIN_DB_PASSWORD=pritesh
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@local
ADMIN_PASSWORD=admin123
```

## Installation & Running

1. **Install dependencies**

```bash
cd services/blog-api
npm install
```

2. **Run database migrations**

```bash
# Run all pending migrations
npm run migration:run

# Show migration status
npm run migration:show
```

3. **Run in dev mode** (auto-reloads on changes)

```bash
npm run start:dev
```

## Database Migrations

TypeORM migrations are used to manage database schema changes.

### Migration Commands

```bash
# Generate a new migration from entity changes
npm run migration:generate -- src/migrations/MigrationName

# Create an empty migration file
npm run migration:create -- src/migrations/MigrationName

# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show

# Sync schema (development only - not recommended for production)
npm run schema:sync

# Drop all tables (WARNING: destroys all data)
npm run schema:drop
```

### Initial Setup

After setting up your PostgreSQL database, run the initial migration:

```bash
npm run migration:run
```

This will create all tables:
- `post` - Blog posts
- `portfolio_item` - Portfolio projects  
- `menu_item` - Navigation menu items

3. **Access the API**

- REST API: http://localhost:4000/api
- GraphQL Playground: http://localhost:4000/graphql

## API Endpoints

### REST API

**Authentication:**
- `POST /api/auth/login` - Admin login

**Blog Posts:**
- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `POST /api/posts` - Create post (protected)
- `PATCH /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

**Portfolio:**
- `GET /api/portfolio` - List all items
- `GET /api/portfolio/featured` - Get featured items
- `GET /api/portfolio/:id` - Get item by ID
- `GET /api/portfolio/slug/:slug` - Get item by slug
- `POST /api/portfolio` - Create item (protected)
- `PATCH /api/portfolio/:id` - Update item (protected)
- `DELETE /api/portfolio/:id` - Delete item (protected)

**Menu:**
- `GET /api/menu` - List all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create menu item (protected)
- `PATCH /api/menu/:id` - Update menu item (protected)
- `DELETE /api/menu/:id` - Delete menu item (protected)

### GraphQL

GraphQL endpoint is still available at `/graphql` for public queries.

## Database Tables

The following tables are automatically created:

- `post` - Blog posts
- `portfolio_item` - Portfolio projects
- `menu_item` - Navigation menu items

## Authentication

**Login via REST API:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"admin123"}'
```

**Use JWT Token:**
```bash
curl -X GET http://localhost:4000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_DB_HOST` | PostgreSQL host | `localhost` |
| `ADMIN_DB_PORT` | PostgreSQL port | `5432` |
| `ADMIN_DB_DATABASE` | Database name | `db_name` |
| `ADMIN_DB_USERNAME` | Database user | `pritesh` |
| `ADMIN_DB_PASSWORD` | Database password | `pritesh` |
| `JWT_SECRET` | JWT secret key | `changeme` |
| `ADMIN_EMAIL` | Admin email | `admin@local` |
| `ADMIN_PASSWORD` | Admin password | `admin123` |
| `NODE_ENV` | Environment | `development` |

## Production Notes

- Set `NODE_ENV=production` to disable auto-synchronization
- Use proper database migrations instead of `synchronize: true`
- Change `JWT_SECRET` to a strong random string
- Use environment-specific `.env` files
- Enable SSL for PostgreSQL connections
- Set up proper CORS origins
