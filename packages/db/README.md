# DB Package

Prisma schema and database utilities.

## Setup
1) Ensure Postgres is running: `pnpm -C ../../ dev:infra`
2) Set DATABASE_URL (root `.env` or this package `.env`)
3) Run migrations: `pnpm -C . prisma migrate dev --name init`
4) Generate client: `pnpm -C . prisma generate`
