export const SCHEMA_ERD = `erDiagram
  REVIEWERS ||--o{ ASSIGNMENTS : "is assigned"
  REVIEWERS ||--o{ AUDIT_LOG : "acts in"
  REVIEWERS ||--o{ SIMULATED_EXCHANGES : "triggers"
  DIALOGUES ||--o{ RESPONSES : "has 2"
  DIALOGUES ||--o{ ASSIGNMENTS : "appears in"
  DIALOGUES ||--o{ SIMULATED_EXCHANGES : "simulated in"
  RESPONSES ||--o{ SIMULATED_EXCHANGES : "sent as"
  ASSIGNMENTS ||--o| REVIEWS : "produces"
  REVIEWS ||--o{ RUBRIC_SCORES : "contains"
  RUBRIC_CRITERIA ||--o{ RUBRIC_SCORES : "scored by"

  REVIEWERS {
    uuid id PK
    text email
    text display_name
    enum role
    text credentials
    timestamptz created_at
    timestamptz last_active_at
  }
  DIALOGUES {
    text id PK
    text review_set
    text scenario
    jsonb turns
    timestamptz created_at
  }
  RESPONSES {
    uuid id PK
    text dialogue_id FK
    text title
    text body
    enum source
    text model_name
    uuid author_id FK
  }
  ASSIGNMENTS {
    uuid id PK
    uuid reviewer_id FK
    text dialogue_id FK
    bool position_shuffle
    timestamptz assigned_at
    timestamptz due_at
  }
  REVIEWS {
    uuid id PK
    uuid assignment_id FK
    enum role
    enum preferred
    text comments
    text expert_notes_a
    text expert_notes_b
    timestamptz submitted_at
  }
  RUBRIC_SCORES {
    uuid id PK
    uuid review_id FK
    enum response_label
    text criterion FK
    int score_1_to_7
    enum expert_answer
  }
  RUBRIC_CRITERIA {
    text name PK
    text description
    int display_order
    bool active
  }
  AUDIT_LOG {
    uuid id PK
    uuid actor_id FK
    text action
    text entity
    text entity_id
    timestamptz at
    jsonb meta
  }
  SIMULATED_EXCHANGES {
    uuid id PK
    uuid reviewer_id FK
    text dialogue_id FK
    uuid sent_response_id FK
    enum sent_label
    text simulated_parent_reply
    text generator
    timestamptz created_at
  }
`;
