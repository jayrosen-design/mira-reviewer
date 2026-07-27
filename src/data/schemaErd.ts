export const SCHEMA_ERD = `erDiagram
  REVIEWERS ||--o{ ASSIGNMENTS : "is assigned"
  REVIEWERS ||--o{ AUDIT_LOG : "acts in"
  REVIEWERS ||--o{ SIMULATED_EXCHANGES : "triggers"
  DIALOGUES ||--o{ RESPONSES : "has 2"
  DIALOGUES ||--o{ ASSIGNMENTS : "appears in"
  DIALOGUES ||--o{ SIMULATED_EXCHANGES : "simulated in"
  RESPONSES ||--o{ SIMULATED_EXCHANGES : "sent as"
  REVIEWERS ||--o{ TRANSCRIPT_BATCHES : "generates"
  TRANSCRIPT_BATCHES ||--o{ GENERATED_TRANSCRIPTS : "contains"
  ASSIGNMENTS ||--o| REVIEWS : "produces"
  REVIEWS ||--o{ RUBRIC_SCORES : "contains"
  RUBRIC_CRITERIA ||--o{ RUBRIC_SCORES : "scored by"

  REVIEWERS {
    uuid id PK
    text email
    text display_name
    enum role "parent | expert | researcher"
    text credentials
    timestamptz created_at
    timestamptz last_active_at
  }
  DIALOGUES {
    text id PK
    text review_set
    enum barrier_category
    text parent_concern
    jsonb turns
    text transcript_id
    int turn_number
    text mira_model_version
    date generation_date
    int randomization_seed
    timestamptz created_at
  }
  RESPONSES {
    uuid id PK
    text dialogue_id FK
    text body
    enum source "human | mira"
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
    enum role "parent | expert"
    enum status "draft | submitted"
    enum preferred "A | B | neither | too_similar"
    text comments
    text expert_notes_a
    text expert_notes_b
    timestamptz submitted_at
    timestamptz updated_at
  }
  RUBRIC_SCORES {
    uuid id PK
    uuid review_id FK
    enum response_label "A | B"
    text criterion FK
    int score_1_to_7
    enum expert_answer "yes | no | unsure"
  }
  RUBRIC_CRITERIA {
    text name PK
    enum type "parent | expert"
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
  TRANSCRIPT_BATCHES {
    uuid id PK
    uuid created_by FK
    text prompt
    int count
    text model_version
    enum status "draft | queued | sent | coded"
    text redcap_record_id
    timestamptz created_at
    timestamptz sent_at
    timestamptz coded_at
  }
  GENERATED_TRANSCRIPTS {
    uuid id PK
    uuid batch_id FK
    text blinded_id
    enum barrier_category
    jsonb turns
    text model_version
    jsonb miti_results
    timestamptz generated_at
  }
  SIMULATED_EXCHANGES {
    uuid id PK
    uuid reviewer_id FK
    text dialogue_id FK
    uuid sent_response_id FK
    enum sent_label "A | B"
    text simulated_parent_reply
    text generator
    timestamptz created_at
  }
`;
