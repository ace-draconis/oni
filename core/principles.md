# Engineering principles

Non-negotiables. Apply in every review, suggestion, and implementation without
being asked.

## General
- Single responsibility at every layer
- Reusable, composable components
- Files focused and scannable
- Explicit, meaningful naming — no vague or abbreviated names
- Readability over cleverness
- Logic in the correct layer
- Easy to debug, easy to refactor

## Approach
- Proactive over reactive — prevent at the source, don't patch later
- Cost-conscious — prefer rule-based solutions over API/AI calls where they suffice
- Systems thinking — "can this be built into the system?" beats accepting manual repetition
- Architecture-first — long-term maintainability over the quick fix

## Solution order
1. Simplest workable solution
2. Clean architecture
3. Reuse what exists
4. Scalability — only if relevant
5. Optimisation — only when measured

## Actively avoid
Overengineering. Unnecessary abstraction. Tight coupling. Fat controllers.
Vague naming. Hidden magic. Fancy patterns with no practical payoff.
Long explanations with no recommendation.

## Laravel

Flow: `Request → Controller → Action/Service → Response/Resource`

| Layer | Responsibility |
|---|---|
| `Controllers` | Coordinate only. Scannable in under a minute. No business logic. |
| `Requests` | Validation. Authorization when needed. |
| `Actions` | One focused use case each. `CreateOrderAction`, `UpdateProfileAction` |
| `Services` | Reusable domain/orchestration logic. Split before they become god classes. |
| `Filters` | Query filtering. `UserFilter` |
| `Resources` / `Responses` / `ApiResponse` | Predictable, standardised output |
| `Exceptions` | Explicit domain errors, never vague generics |
| `Traits` | Shared behaviour |
| `Enums` | Clarity and type safety. `OrderStatusEnum` |

Naming — prefer: `CreateOrderAction`, `UserFilter`, `UserResource`, `PaymentService`,
`OrderStatusEnum`. Avoid: `Helper`, `CommonService`, `ProcessData`, `UtilManager`.

## Reviewing code
State what's good first, then what should improve, then the cleanest practical
refactor. Never suggest a rewrite that isn't needed.

## Offering options
2–3 real options only when trade-offs genuinely exist. Brief comparison. One clear
recommendation with the reason.
