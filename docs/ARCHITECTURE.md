# Architecture Overview

## Modules
- Ingestion: webhook/log/metrics/trace intake and normalization
- Pipeline: event bus, noise reduction, correlation
- Intelligence: RCA engine + RAG + guardrails
- SaaS: multi-tenant RBAC, incident mgmt, SLO/SLA

## Data Stores
- Postgres: tenants, users, incidents, audit logs
- Redis: caching, rate limits
- Object Storage: raw logs and artifacts
- Vector DB: RAG embeddings

## Non-Functional Requirements
- Multi-tenant isolation
- Auditability
- Cost and latency governance for AI
- Observability-first
