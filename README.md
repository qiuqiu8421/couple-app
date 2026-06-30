# Couple Space

A private content-space web application built as a full-stack deployment and operations project. The repository is kept as a public showcase of the application architecture, code organization, and server-maintenance workflow; real production secrets and host-specific configuration are intentionally excluded.

## Features

- Credential-based authentication with NextAuth
- Timeline posts with text, images, videos, likes, and comments
- Album management for uploaded media
- Anniversary countdowns
- Password change flow
- Soft deletes for posts, albums, and album media
- Docker-oriented deployment with persistent database and upload storage

## Tech Stack

| Layer | Technology |
| --- | --- |
| Web app | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth v5 credentials provider |
| Database | PostgreSQL, Prisma 7 |
| Runtime | Node.js container |
| Reverse proxy | Nginx |
| Deployment | Docker Compose on a Linux server |

## Architecture

```text
Browser
  -> Nginx reverse proxy
  -> Next.js application container
  -> PostgreSQL container

Uploaded media
  -> bind-mounted server directory
  -> /app/public/uploads inside the app container
```

More details are in [docs/architecture.md](docs/architecture.md).

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env` from [.env.example](.env.example), then generate Prisma Client:

```bash
npx prisma generate
```

Run the app:

```bash
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

## Deployment Notes

This public repository intentionally omits production hostnames, IP addresses, credentials, certificates, and Docker host configuration. A private deployment repository or server-local configuration should hold those details.

See [DEPLOY.md](DEPLOY.md) and [docs/operations.md](docs/operations.md) for sanitized examples.
