---
name: docker-mysql-shared-network
type: pattern
tags: [docker, mysql, local-dev]
project: f3-fms
date: 2026-05-04
---

## Problem
Each new project spinning up its own MySQL container — wasted memory, port
collisions, N copies of the same data.

## Solution
One shared MySQL container on a named external network; every project joins it.

    networks:
      borong-network:
        external: true

DB host is the container name (`borong_mysql`), not `localhost`. No port mapping to
host — internal network only. phpMyAdmin on 8080 covers browser access.

## Why it works
Docker's internal DNS resolves container names on a shared network, so nothing needs
host ports and nothing collides.

## Watch out for
The network must exist before `docker compose up`:
`docker network create borong-network`. External tools on the host can't reach the DB
by design — use phpMyAdmin or `docker exec`.
