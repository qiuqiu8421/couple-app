# Architecture

## Overview

Couple Space is a full-stack Next.js application with authentication, media upload, timeline posts, album management, and anniversary tracking.

The production shape is intentionally simple:

```text
Browser
  -> Nginx
  -> Next.js app container
  -> PostgreSQL container
```

## Application Layer

- Next.js App Router handles page routing and API route handlers.
- Server components perform session checks for protected pages.
- Client components manage interactive views such as timeline posts, albums, comments, likes, and uploads.
- NextAuth credentials provider validates username/password login against users stored in PostgreSQL.

## Data Layer

Prisma models cover:

- users
- posts
- post media
- comments
- likes
- albums
- album media
- anniversaries

Posts, albums, and album media use soft deletes through a nullable `deletedAt` field. User-facing queries filter soft-deleted records by default.

## Media Storage

Uploaded images and videos are written to:

```text
public/uploads
```

In production this path should be backed by a bind mount or persistent volume so files survive container restarts and application image rebuilds.

## Deployment Boundaries

This public repository contains application code and sanitized documentation. Production-only configuration belongs in a private deployment repository or on the server:

- Docker Compose production file
- Nginx virtual host configuration
- TLS certificate configuration
- environment variables
- backup scripts
- server inventory and hostnames
