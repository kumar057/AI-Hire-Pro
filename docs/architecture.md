# Architecture

AIHire Pro is initialized as a monorepo with independent frontend and backend
applications plus shared operational assets.

## Boundaries

- `frontend` owns browser UI, routing, HTTP clients, client-side state, and visual assets.
- `backend` owns API contracts, application services, repositories, persistence, and security infrastructure.
- `database` owns PostgreSQL bootstrap configuration and documentation.
- `docker` owns container images and runtime web server configuration.
- `scripts` owns repeatable local developer automation.

## Backend Layers

- Routers expose HTTP endpoints and dependency injection.
- Schemas define external API contracts with Pydantic.
- Services contain application use cases.
- Repositories isolate persistence access.
- Models define SQLAlchemy ORM entities.
- Middleware handles cross-cutting request behavior.
- Auth contains authentication and authorization primitives.
- Config centralizes environment-driven settings.

## Scalability Direction

The foundation is prepared for stateless API instances, horizontally scalable
frontend hosting, PostgreSQL-backed persistence, structured logging, and future
CI/CD migration gates. Business domains should be introduced as vertical slices
that preserve these boundaries.

