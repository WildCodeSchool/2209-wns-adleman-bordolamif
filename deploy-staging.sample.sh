#!/bin/sh
git fetch origin && git reset --hard origin/develop && git clean -f -d && \
docker compose -f docker-compose.staging.yml down && \
docker image prune -af && \
docker compose -f docker-compose.staging.yml pull && \
docker compose -f docker-compose.staging.yml --env-file .env.staging up -d;
