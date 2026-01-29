# Architecture, Business, and Principles

## Business Overview
AI DevOps Assistant is a B2B SaaS platform that ingests operational signals (logs, metrics, traces, alerts, webhooks) and turns them into actionable incident workflows. The current implementation focuses on:
- Ingesting events reliably
- Persisting events for audit and analysis
- Publishing events to a message bus for async processing
- Managing incidents with multi-tenant isolation

### Current Capabilities
- Ingest API: `/ingest/webhook`, `/ingest/logs`, `/ingest/metrics`, `/ingest/traces`
- Incident API: list/create/get/close incidents
- Multi-tenant access via `x-tenant-id`
- JWT-based auth and RBAC permissions
- Swagger docs at `/docs`
- Request tracing via `x-request-id`
- NATS consumer for ingest events

---

## Architecture Overview

### Layers (Clean Architecture)
- **Domain**: core business models (e.g., `Incident`, `Event`)
- **Application**: use cases and ports (business logic, interfaces for repositories and event bus)
- **Infrastructure**: concrete implementations (Prisma/Postgres, NATS)
- **Interfaces (HTTP)**: controllers, routes, validation, and error mapping

### Runtime Components
- **API Service** (Fastify)
  - HTTP routes → controllers → use cases → repositories
  - Swagger documentation
- **Worker/Consumer**
  - Subscribes to `ingest.events` and processes async workloads
- **Data Stores**
  - Postgres (persistent business data)
  - Redis (reserved for caching/rate limiting)
- **Message Bus**
  - NATS for event-driven async processing
  - Redpanda (Kafka-compatible) reserved for future scale

---

## Core Principles (Why This Design)

### 1) Split Command and Event Flows
- **Command path** (sync): validate and store events, respond quickly
- **Event path** (async): publish to NATS for downstream processing

**Principle**: synchronous operations stay lightweight; heavy processing is async to keep latency and reliability in check.

### 2) Dependency Direction Inwards
- Domain and use cases do not depend on frameworks
- Infrastructure adapts to the business layer, not the other way around

**Principle**: keep core logic stable and replaceable (e.g., NATS ↔ Kafka).

### 3) Multi-Tenant Isolation
- Every request is authenticated and mapped to a tenant
- Data storage is tenant-scoped

**Principle**: tenant isolation is non-negotiable for SaaS correctness and compliance.

### 4) Observability First
- `x-request-id` is injected and returned for tracing
- Structured logging enables debugging across distributed flows

**Principle**: if you can’t trace, you can’t scale.

### 5) Testing as a Gate
- Every new feature includes tests and verification steps
- Documented in `docs/DEV_RULES.md`

**Principle**: faster iteration requires stronger safety nets.

---

## Current Data Flow

1. Client calls an `/ingest/*` endpoint with `x-tenant-id`
2. API validates input and writes an `Event` record to Postgres
3. API publishes the same event to NATS (`ingest.events`)
4. Consumer reads from NATS and processes the event asynchronously
5. Incident APIs manage incident lifecycle

---

## Next-Stage Extensions (Planned)
- Event normalization, correlation, and noise reduction
- Incident RCA with AI support
- SLO/SLA based alerting
- RBAC + audit logging enhancements
- Cost governance for AI workflows
