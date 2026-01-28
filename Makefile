.PHONY: dev infra

dev:
	@echo "Use pnpm dev"

infra:
	docker compose -f infra/docker-compose.yml up -d
