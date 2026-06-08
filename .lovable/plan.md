## Goal

Document the data model and API surface for the future real-backend version of MIRA so the design and engineering teams have a concrete reference. Surface it in two places: the README, and new in-app API docs pages reachable from the navbar.

## 1. README additions

Add two new sections after the existing "How it works" diagram:

### Data model (example tables)

Concise table-by-table reference with column name, type, and a sample row. Tables:

- **reviewers** — `id (uuid)`, `email`, `display_name`, `role (reviewer|researcher|admin)`, `credentials`, `created_at`, `last_active_at`
- **dialogues** — `id`, `review_set`, `scenario`, `turns (jsonb: [{speaker, text}])`, `created_at`
- **responses** — `id`, `dialogue_id (fk)`, `label (A|B)`, `title`, `text`, `source (human|ai)`, `model_name` (nullable), `author_id` (nullable, for human-authored)
- **assignments** — `id`, `reviewer_id (fk)`, `dialogue_id (fk)`, `position_shuffle (bool — whether A/B were swapped at display)`, `assigned_at`, `due_at`
- **reviews** — `id`, `assignment_id (fk)`, `selected (A|B|neither|too_similar)`, `guess_a (human|ai|null)`, `guess_b (human|ai|null)`, `comments`, `submitted_at`
- **rubric_scores** — `id`, `review_id (fk)`, `response_label (A|B)`, `criterion`, `score (1–5)`
- **rubric_criteria** — `id`, `name`, `description`, `display_order`, `active`
- **audit_log** — `id`, `actor_id`, `action`, `entity`, `entity_id`, `at`, `meta`

Each table gets a one-line "why it exists" note and a single sample JSON row for clarity.

### Randomization & assignment rules

Short callout describing: per-reviewer unseen sampling, A/B position shuffle, balanced human/AI distribution, optional overlap dialogues for inter-rater agreement.

## 2. New in-app API docs pages

Add an "API Docs" entry to `src/components/mira/NavBar.tsx` that links to `/api-docs` (overview/index page) with sub-routes for each resource group.

### Routes (TanStack file-based)

- `src/routes/api-docs.tsx` — layout route (renders `<Outlet />` + a left-side sub-nav listing the resource groups).
- `src/routes/api-docs.index.tsx` — overview: base URL, auth model (bearer JWT from reviewer login), versioning (`/v1`), error envelope, pagination convention.
- `src/routes/api-docs.auth.tsx` — `POST /v1/auth/login`, `POST /v1/auth/logout`, `GET /v1/auth/me`.
- `src/routes/api-docs.dialogues.tsx` — `GET /v1/dialogues/next` (returns next assignment with A/B shuffled), `GET /v1/dialogues/:id`.
- `src/routes/api-docs.reviews.tsx` — `POST /v1/reviews` (submit ratings + guesses + comments), `GET /v1/reviews/:id`, `PATCH /v1/reviews/:id` (edit before deadline).
- `src/routes/api-docs.progress.tsx` — `GET /v1/me/progress`, `GET /v1/reviewers/:id/progress` (researcher-only).
- `src/routes/api-docs.metrics.tsx` — `GET /v1/metrics/overview`, `GET /v1/metrics/source-accuracy`, `GET /v1/metrics/inter-rater-agreement`, `GET /v1/metrics/leaderboard`.

### Endpoint page format

Each docs page renders a small reusable component (`ApiEndpoint`) for every endpoint with:

- HTTP method + path (color-coded badge)
- One-sentence purpose
- Auth requirement (reviewer / researcher / admin)
- Request shape (params, query, JSON body) with a typed example
- Response shape with a typed JSON example
- Common error responses (`401`, `403`, `404`, `409`, `422`)

All examples use mock JSON literals — no real fetch calls. This is documentation only, no backend wiring.

## 3. Out of scope

- No actual backend, auth, or database is wired up — content remains mock data.
- No edits to existing Review / Progress / Dashboard pages beyond the navbar addition.
- No code generation from a spec file (OpenAPI). The docs are hand-authored JSX so the design team can style and iterate freely.

## Files touched

- `README.md` — append Data model + Randomization sections.
- `src/components/mira/NavBar.tsx` — add API Docs link.
- `src/components/mira/ApiEndpoint.tsx` — new reusable docs block.
- `src/routes/api-docs.tsx` — layout with sub-nav + `<Outlet />`.
- `src/routes/api-docs.index.tsx` + 5 resource sub-pages listed above.
