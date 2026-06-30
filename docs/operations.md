# Operations

This document records the operational patterns used by the project without exposing real infrastructure details.

## Deployment Flow

1. Push application code to the application repository.
2. On the server, fetch the selected branch.
3. Reset the app checkout to the selected revision.
4. Apply Prisma schema changes when needed.
5. Restart the app container.

Example:

```bash
cd /path/to/app
git fetch origin
git reset --hard origin/main
docker compose exec app npx prisma db push
docker compose restart app
```

## Password Recovery

User passwords are stored as bcrypt hashes. Recovery means resetting a user's password to a newly generated hash, not reading the old password.

Operational rule:

- generate a new bcrypt hash
- update only the affected user row
- ask the user to change the password after login

## Soft Delete Policy

The app uses soft deletes for user-created timeline and album content:

- `Post.deletedAt`
- `Album.deletedAt`
- `AlbumMedia.deletedAt`

The UI hides soft-deleted records. This prevents accidental data loss while keeping the implementation lightweight.

## Backup Scope

Back up both:

- PostgreSQL data
- persistent upload directory

Database-only backups are not sufficient because uploaded media lives on disk.

## Private Deployment Repository

A separate private repository can store production-only assets:

```text
deploy/
  docker-compose.yml
  nginx/
    site.conf
  scripts/
    deploy.sh
    backup-db.sh
    backup-uploads.sh
  env/
    app.env.example
```

Do not make that repository public.
