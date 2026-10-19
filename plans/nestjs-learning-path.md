# NestJS learning path: from basics to wetstock and a monorepo

**Project**: silentmode-monorepo (practice repo); wetstock (study target)
**Status**: In progress
**Goal**: Understand how the wetstock microservice works end to end, and be able to
extend it into a monorepo that can later hold all microservices in one repository.

## Method

Each module has four parts:

1. **Concept**: the idea, mapped to its Laravel equivalent.
2. **Build**: implemented in `silentmode-monorepo` as a smaller version of wetstock
   (outlets, tanks, dippings). One commit per module, prefixed `[plan:nestjs-learning-path]`.
3. **Wetstock tie-in**: the same concept located in the real code.
4. **Quiz**: 8–10 questions (concept, predict-the-output, spot-the-bug, translate from
   Laravel). The pass mark is 80%. Missed questions are carried into the next quiz.

The curriculum is adaptive. Modules may be split, extended, reordered, or supplemented
with remedial material when quiz results or pace show a gap. Every change is recorded
in the Adjustments log below.

Practice database: Postgres, to match wetstock (it uses Postgres-specific SQL).
Practice repo: `ace-draconis/silentmode-monorepo` (private, personal). The real
company monorepo would live on the company GitLab.

## Steps

### Phase 1: Foundations
- [ ] 0. Node.js and TypeScript for PHP developers: process model, event loop,
      promises and async/await, type erasure, classes and interfaces, decorators and
      reflect-metadata, ESM vs CommonJS, package.json and lockfiles
- [ ] 1. Anatomy of a Nest app: main.ts, NestFactory, root module, build output, watch mode
- [ ] 2. Controllers and routing: route decorators, parameter decorators, status codes,
      route order, @Res(), async handlers
- [ ] 3. Providers, modules and dependency injection: imports/exports, resolution errors,
      scopes, custom providers, injection tokens, global modules, forwardRef

### Phase 2: The HTTP layer
- [ ] 4. Validation and DTOs: ValidationPipe options, class-validator, class-transformer,
      built-in pipes, custom DI-aware validators, 422 responses
- [ ] 5. Request lifecycle: middleware, guards, interceptors, pipes, exception filters,
      scope and execution order
- [ ] 5.5. State and request context: stateless vs stateful services, reproducing the
      singleton tenant leak under concurrency, parameters vs AsyncLocalStorage
      (nestjs-cls) vs request scope, legitimately shared state (caches, pools)
- [ ] 6. Configuration: @nestjs/config, env validation, comparison with wetstock's dotenv setup

### Phase 3: Data
- [ ] 7. TypeORM basics: Postgres in Docker, entities, decimals and transformers,
      relations, repositories, find options, soft deletes, query builder, bound
      parameters, the undefined-where trap
- [ ] 8. Migrations: DataSource file, generate/run/revert, synchronize off, migrations
      at boot, deploy-before-migrate safety
- [ ] 9. Transactions and consistency: entityManager.transaction, writes through mgr,
      replica lag, subscribers, idempotency
- [ ] 10. Serialization and responses: ClassSerializerInterceptor, @Exclude/@Expose,
      response DTOs, pagination, date formatting

### Phase 4: Quality
- [ ] 11. Testing: testing modules, mocking providers, e2e with supertest and a real database

### Phase 5: Beyond HTTP
- [ ] 12. Standalone application context: createApplicationContext, app.get(), CLI
      commands, a queue consumer, unvalidated non-HTTP inputs
- [ ] 13. Lambda and Serverless: execution model, cold and warm starts,
      serverless-express, serverless.yml, SQS, schedules, SSM, serverless-offline

### Phase 6: Wetstock end to end
- [ ] 14. Capstone A: trace dipping create (HTTP), receipt ingest (SQS) and balance
      refresh (schedule); explain and propose fixes for every entry in known-issues.md

### Phase 7: Monorepo
- [ ] 15. Monorepo architecture: Nest monorepo mode vs yarn/pnpm workspaces vs Nx;
      decide and record an ADR
- [ ] 16. Capstone B: import wetstock with history, extract shared libs, per-app build
      and deploy

## Quiz results
| Module | Date | Score | Carried-forward topics |
|---|---|---|---|

## Adjustments log
| Date | Change | Reason |
|---|---|---|
| 2026-10-19 | Added module 5.5 (State and request context) | State handling was spread across modules 0, 3, 5 and 13 and never taught as one topic |

## Changes
| File | Change |
|---|---|

## Completion record
[Ticket ID and link after the work ships.]
