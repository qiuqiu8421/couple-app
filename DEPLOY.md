# Deployment Guide

This is a sanitized deployment guide for the public showcase repository. Keep real server IPs, domains, SSH details, database passwords, access tokens, and certificate paths in a private deployment repository or server-local configuration.

## Runtime Layout

The production setup is designed around three services:

| Service | Purpose |
| --- | --- |
| `app` | Next.js application |
| `db` | PostgreSQL database |
| `nginx` | Reverse proxy and TLS termination |

Typical request flow:

```text
client -> nginx -> app -> db
```

Uploaded files should be stored on a persistent host volume and mounted into:

```text
/app/public/uploads
```

## Required Environment Variables

Create production environment variables outside this public repository:

```env
DATABASE_URL="postgresql://USER:PASSWORD@db:5432/DATABASE"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="https://example.com"
SEED_USER_ONE_USERNAME="demo_user_one"
SEED_USER_ONE_PASSWORD="replace-before-seeding"
SEED_USER_ONE_NAME="User One"
SEED_USER_TWO_USERNAME="demo_user_two"
SEED_USER_TWO_PASSWORD="replace-before-seeding"
SEED_USER_TWO_NAME="User Two"
```

## Common Operations

Check containers:

```bash
docker compose ps
```

Check app logs:

```bash
docker compose logs app --tail=50
```

Restart the app container:

```bash
docker compose restart app
```

Apply schema changes:

```bash
docker compose exec app npx prisma db push
```

Run seed data:

```bash
docker compose exec app npx tsx prisma/seed.ts
```

## Public Repository Policy

Do not commit:

- `.env` files
- database credentials
- SSH keys
- access tokens
- real server IPs or hostnames
- certificate files
- production Docker Compose overrides
- private media or personal uploads

Use a private deployment repository for host-specific files and scripts.
