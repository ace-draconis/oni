---
name: scaffold
description: Generate Laravel Actions, Requests, Filters, Resources, Services, Enums, and Exceptions following Aniki's exact conventions rather than framework defaults. Triggers on "create an action", "scaffold", "new service", "add a resource", "make a filter", or any request to add a new Laravel class.
---

# Scaffold

Generate to Aniki's conventions in `core/principles.md`, never to `php artisan make:`
defaults. Match the surrounding project's existing style over anything here — read a
neighbouring file first.

## Layers

| Class | Location | Shape |
|---|---|---|
| Action | `app/Actions/` | One public `handle()`. One use case. `CreateOrderAction` |
| Request | `app/Http/Requests/` | `rules()`, `authorize()` when needed |
| Filter | `app/Filters/` | Query filtering only. `UserFilter` |
| Resource | `app/Http/Resources/` | Output shape. `UserResource` |
| Service | `app/Services/` | Reusable domain logic. `PaymentService` |
| Enum | `app/Enums/` | Backed enum. `OrderStatusEnum` |
| Exception | `app/Exceptions/` | Specific domain error, never generic |

## Rules

- Constructor property promotion, typed properties, strict return types
- No business logic in the controller — the controller calls the Action, full stop
- No `Helper`, `Manager`, `Util`, `Common`, `Process*` in any name. If the right name
  is unclear, the responsibility is unclear — resolve that first
- One responsibility per class. If two verbs describe it, it's two classes
- Wire it up: register the binding, add the route, update the controller. A generated
  class nobody calls is not done

## Before generating

Read an existing sibling class. Project convention beats this document — match its
namespace, docblock style, and error handling.
