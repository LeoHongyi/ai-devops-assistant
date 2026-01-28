# Project Plan (12+ Months)

## Goals
- Build a multi-tenant B2B SaaS for incident analysis and AI-assisted operations.
- Demonstrate enterprise-grade architecture: reliability, security, observability, cost control.
- Produce English documentation, diagrams, and case studies for remote hiring.

## Time Budget
- 28–35 hours/week

## Phase 1 (Month 1–2): Foundation
### Objectives
- Monorepo structure, dev tooling, initial CI
- Multi-tenant auth + RBAC + audit logs
- Ingest MVP (webhook + log upload)

### Deliverables
- Tenant/user/role model in DB
- Auth endpoints + session/JWT
- Webhook ingest with normalization
- Initial dashboard and event list

## Phase 2 (Month 3–5): Event Pipeline & Incident Mgmt
### Objectives
- Event bus + noise reduction + incident correlation
- Service topology model

### Deliverables
- Event bus (NATS/Kafka) wiring
- Noise reduction rules and dedup
- Incident lifecycle: create/assign/close
- Service dependency graph + event chain view

## Phase 3 (Month 6–9): AI & RAG
### Objectives
- RCA engine + runbook generation
- RAG integration + AI governance

### Deliverables
- RCA v1 (rules + event chain)
- RAG retrieval from incident history/runbooks
- AI router + guardrails + confidence score
- Cost controls: token budgets, caching

## Phase 4 (Month 10–12+): Architect-Level Enhancements
### Objectives
- Production-grade reliability, compliance, and cost optimization
- External communication assets

### Deliverables
- SLO/SLI and alerting strategy
- Multi-env deploy (dev/stage/prod) and HA plan
- Security posture + SOC2-style checklist
- Public English docs + system design doc + case study

## Weekly Cadence (Example)
- Mon–Tue: feature build (backend + data)
- Wed: pipeline/AI or infra tasks
- Thu: frontend and UX polish
- Fri: docs, testing, refactor, backlog grooming
- Sat/Sun (optional): architecture/design + learning buffer

## Milestones
1. M2: MVP Ingest + RBAC + Dashboard
2. M5: Incident pipeline + topology
3. M9: AI RCA + runbook generation
4. M12: production readiness + docs
