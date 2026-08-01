# Database

AIHire Pro uses PostgreSQL as its system of record.

The `init` directory is mounted by Docker Compose during first database startup.
Schema evolution belongs in Alembic migrations under `backend/alembic/versions`.

## Local Defaults

- Database: `aihire_pro`
- User: `aihire`
- Port: `5432`
- Async SQLAlchemy URL: `postgresql+asyncpg://aihire:aihire@localhost:5432/aihire_pro`

## Production Notes

- Use managed PostgreSQL with automated backups, point-in-time recovery, and read replicas.
- Store credentials in a secret manager, not in compose files.
- Tune `postgresql.conf` for the target instance class and traffic profile.
- Apply migrations through CI/CD with review gates.

