# AI DevOps Assistant (Monorepo)

Enterprise-grade AI DevOps Assistant for incident analysis, RCA, and runbook automation.

## Structure
- apps/web: Next.js frontend
- apps/api: API gateway/services
- packages/auth: Auth/RBAC
- packages/ingest: Webhook/log ingest + normalization
- packages/pipeline: Event processing, noise reduction, correlation
- packages/ai: RCA, RAG, guardrails
- packages/obs: Observability utilities
- packages/shared: Shared types/utilities
- docs: Planning, architecture, ADRs
- infra: Deployment and infra notes
- scripts: Tooling
