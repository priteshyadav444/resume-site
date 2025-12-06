# Database Migrations Guide

This project uses TypeORM migrations to manage database schema changes.

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run initial migration** to create all tables:
   ```bash
   npm run migration:run
   ```

## Available Commands

### Run Migrations

```bash
# Run all pending migrations
npm run migration:run

# Show which migrations have been run
npm run migration:show
```

### Create New Migrations

```bash
# Generate migration from entity changes (auto-detects changes)
npm run migration:generate -- src/migrations/AddNewColumnToPost

# Create empty migration file (manual migration)
npm run migration:create -- src/migrations/AddNewColumnToPost
```

### Revert Migrations

```bash
# Revert the last executed migration
npm run migration:revert
```

### Schema Management (Development Only)

```bash
# Sync schema with entities (WARNING: may lose data)
npm run schema:sync

# Drop all tables (WARNING: destroys all data)
npm run schema:drop
```

## Migration Workflow

### 1. Making Schema Changes

When you modify an entity file (e.g., `blog.entity.ts`):

1. **Generate migration**:
   ```bash
   npm run migration:generate -- src/migrations/DescribeYourChange
   ```

2. **Review the generated migration** in `src/migrations/`

3. **Run the migration**:
   ```bash
   npm run migration:run
   ```

### 2. Manual Migrations

For complex changes or data migrations:

1. **Create empty migration**:
   ```bash
   npm run migration:create -- src/migrations/ComplexDataMigration
   ```

2. **Edit the migration file** to add your custom SQL or TypeORM operations

3. **Run the migration**:
   ```bash
   npm run migration:run
   ```

## Migration Files

Migrations are stored in `src/migrations/` with the naming pattern:
```
<TIMESTAMP>-<MigrationName>.ts
```

Example: `1700000000000-InitialSchema.ts`

## Database Tables

The initial migration creates these tables:

- **post** - Blog posts with SEO fields
- **portfolio_item** - Portfolio projects with images and SEO
- **menu_item** - Navigation menu items

## Production Deployment

For production:

1. **Disable synchronize** in `app.module.ts` (already configured)
2. **Run migrations** before starting the app:
   ```bash
   npm run migration:run
   npm start
   ```

Or set `RUN_MIGRATIONS=true` in your production `.env` to auto-run migrations on startup.

## Troubleshooting

### Migration fails to connect

Check your `.env` file has correct database credentials:
```
ADMIN_DB_HOST=localhost
ADMIN_DB_PORT=5432
ADMIN_DB_DATABASE=db_name
ADMIN_DB_USERNAME=pritesh
ADMIN_DB_PASSWORD=pritesh
```

### Migration already exists error

If you see "Migration already exists", the migration has already been run. Check status:
```bash
npm run migration:show
```

### Need to reset database

⚠️ **WARNING**: This will delete all data!

```bash
npm run schema:drop
npm run migration:run
```

