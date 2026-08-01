# Security Baseline

- Keep all secrets out of Git and load them through environment variables.
- Replace local JWT secrets before deploying any shared environment.
- Keep API instances stateless and terminate TLS at the ingress or load balancer.
- Restrict CORS origins per environment.
- Run database migrations as a controlled deployment step.
- Add centralized audit logging before introducing privileged workflows.
- Add rate limiting and abuse protection before opening public traffic.

