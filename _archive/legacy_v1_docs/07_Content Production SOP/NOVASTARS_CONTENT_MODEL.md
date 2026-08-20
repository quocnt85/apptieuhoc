# NOVASTARS CONTENT MODEL SPECIFICATION
## The Constitutional Content Architecture & Domain Model of NovaStars

---

> [!IMPORTANT]
> **Single Source of Truth**: This specification defines the canonical domain model, taxonomy, object contracts, metadata schemas, versioning protocols, and relationship graphs for all educational content in NovaStars. It is the authoritative architectural blueprint for the AI Content Factory, CMS, Database Schema, Backend API, Frontend Engine, Analytics Pipelines, and Parent Dashboard across **10,000+ lessons** worldwide.

---

## TABLE OF CONTENTS
1. [PART 1: Content Architecture Philosophy](#part-1-content-architecture-philosophy)
2. [PART 2: Content Hierarchy](#part-2-content-hierarchy)
3. [PART 3: Learning Experience Model](#part-3-learning-experience-model)
4. [PART 4: Learning Object Taxonomy](#part-4-learning-object-taxonomy)
5. [PART 5: Story Architecture](#part-5-story-architecture)
6. [PART 6: Game Architecture](#part-6-game-architecture)
7. [PART 7: Boss Architecture](#part-7-boss-architecture)
8. [PART 8: Reflection Architecture](#part-8-reflection-architecture)
9. [PART 9: Challenge Architecture](#part-9-challenge-architecture)
10. [PART 10: Evidence Architecture](#part-10-evidence-architecture)
11. [PART 11: Universal Metadata System](#part-11-universal-metadata-system)
12. [PART 12: Content Relationships & Graph Model](#part-12-content-relationships--graph-model)
13. [PART 13: Versioning & Dependency Strategy](#part-13-versioning--dependency-strategy)
14. [PART 14: AI Integration & Micro-Generation Architecture](#part-14-ai-integration--micro-generation-architecture)
15. [PART 15: CMS Architecture Requirements](#part-15-cms-architecture-requirements)
16. [PART 16: Content Quality & Validation Framework](#part-16-content-quality--validation-framework)
17. [PART 17: Architectural Scalability System](#part-17-architectural-scalability-system)
18. [PART 18: Authoritative Domain Glossary](#part-18-authoritative-domain-glossary)
19. [PART 19: Decision Log & Architectural Trade-offs](#part-19-decision-log--architectural-trade-offs)

---

## PART 1: Content Architecture Philosophy

### 1.1 Purpose & Scope
The NovaStars Content Model establishes a decoupled, highly structured, and machine-interpretable educational content domain. It shifts NovaStars from static "lesson documents" to an **Object-Centric Educational Architecture**. This architecture decouples educational intent (competency mastery) from instructional delivery (learning experiences) and content assets (stories, games, reflections, visuals).

### 1.2 Relationship with Foundational Frameworks
The Content Model does not reinvent existing foundational concepts. It operationalizes them into system contracts:
* **Product Foundation**: Translates product missions and target age profiles (6-11 years) into localized, age-appropriate content parameters.
* **Competency Framework (LSCAF)**: Serves as the immutable root anchor for all learning objects.
* **Experience Framework (Experience OS)**: Defines psychological states, emotional curves, and flow constraints enforced during learning object assembly.
* **NovaStars Lesson Architecture System (NLAS)**: Provides the 7-Stage instructional blueprint that standardizes how Learning Objects assemble into executable Learning Experiences.

```
+-------------------------------------------------------------------------+
|                  UNIVERSAL COMPETENCY FRAMEWORK (LSCAF)                 |
|                      (Competencies, Sub-Competencies)                   |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                    EXPERIENCE FRAMEWORK (Experience OS)                 |
|                    (Emotional Curves, Curiosity Engine)                 |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                NOVASTARS LESSON ARCHITECTURE SYSTEM (NLAS)               |
|                  (7-Stage Blueprint, Stage Constraints)                 |
+-------------------------------------------------------------------------+
                                     │
                                     ▼
+-------------------------------------------------------------------------+
|                     NOVASTARS CONTENT MODEL (NSCM)                      |
|          (Learning Experiences, Reusable LO Taxonomy, Metadata)         |
+-------------------------------------------------------------------------+
```

### 1.3 Core Design Principles

#### 1. Competency-Centric
Competency is the Single Source of Truth. No Learning Object (LO) or Learning Experience (LX) exists without binding to at least one primary competency code from LSCAF. Educational value is measured exclusively by competency mastery progression.

#### 2. Object-Centric
Lessons are strictly forbidden from being stored as monolithic text files or static scripts. A lesson is dynamically assembled at runtime from granular, independent **Learning Objects**. Each object possesses an immutable UUID, strict metadata, independent semantic versioning, validation rules, and isolated lifecycle states.

#### 3. Learning Experience-Centric
Learners never see or interact with raw "Objects". They participate in a cohesive **Learning Experience (LX)**. An LX orchestrates multiple Learning Objects into a seamless narrative and pedagogical arc, managing state transitions, difficulty scaling, and feedback loops.

#### 4. High Reusability
All Learning Objects (mini games, story nodes, dialogue branches, reflection prompts, NPC profiles, challenge templates) are designed for cross-contextual reuse. A single NPC or Mini Game template can be configured across hundreds of competencies, grades, seasonal events, and country localizations without code duplication.

#### 5. Independent Semantic Versioning
Every Learning Object and Learning Experience maintains independent Semantic Versioning (`MAJOR.MINOR.PATCH`). Changes to an individual object do not force global lesson refactoring; dependency graphs automatically route runtime execution to compatible object versions.

#### 6. AI-First Architecture
Content schemas are strictly typed JSON contracts designed for direct ingestion, generation, validation, and optimization by Large Language Models (LLMs) and Autonomous AI Agents. AI tools produce and edit content at the **Object level**, rather than modifying entire lessons.

---

## PART 2: Content Hierarchy

### 2.1 The Complete Hierarchy Stack

```
LEVEL 0: Competency Domain (e.g., Emotional Intelligence, Financial Literacy)
   │
   ├── LEVEL 1: Competency (e.g., FIN-EMOTION-01: Impulse Control in Buying)
   │     │
   │     ├── LEVEL 2: Learning Experience (LX) (Executable 7-Stage Lesson Instance)
   │     │     │
   │     │     ├── LEVEL 3: Learning Objects (LO) (Granular Pedagogical Entities)
   │     │     │     ├── Story Node / Scene
   │     │     │     ├── Mini Game Instance
   │     │     │     ├── Reflection Prompt
   │     │     │     ├── Real-World Challenge Candidate
   │     │     │     └── Boss Battle Specification
   │     │     │
   │     │     └── LEVEL 4: Assets (Raw Media Resources)
   │     │           ├── Audio Clips (.mp3, .ogg)
   │     │           ├── 2D/3D Art & Animations (.png, .fbx, .spine)
   │     │           ├── Sprite Sheets & Particle FX
   │     │           └── String Translation Bundles (.json)
```

### 2.2 Architectural Justification of Levels
* **Domain & Competency (L0 - L1)**: Define *WHAT* real-world life skill is being mastered. Independent of UI, game mechanics, or narrative.
* **Learning Experience (L2)**: Defines *HOW* a learner masters the competency in a single session. It acts as an orchestration manifest wiring L3 objects into an NLAS 7-stage sequence.
* **Learning Objects (L3)**: Reusable, self-contained educational & interactive building blocks. An L3 object contains instructional logic, parameters, and metadata, but no raw rendering binaries.
* **Assets (L4)**: Platform-agnostic, raw media resources referenced by L3 objects. Decoupling L4 assets allows instant localization (swapping voiceovers or art assets) without mutating instructional logic.

---

## PART 3: Learning Experience Model

### 3.1 Definition & Purpose
A **Learning Experience (LX)** is the executable instructional unit in NovaStars. It binds a target Competency to a sequence of Learning Objects structured according to NLAS 7-Stage rules.

### 3.2 LX Object Manifest Schema

```json
{
  "$schema": "https://novastars.io/schemas/v1/learning-experience.json",
  "lx_id": "LX-FIN-EMOTION-01-GRADE2-VN",
  "version": "1.2.0",
  "metadata": {
    "title": "The Impulse Monster at the Toy Market",
    "target_competency_code": "FIN-EMOTION-01",
    "target_grade": 2,
    "age_range": [7, 8],
    "estimated_duration_seconds": 900,
    "pattern_id": "PATTERN-EMOTION-REGULATION-04",
    "language": "vi-VN",
    "country": "VN",
    "status": "PUBLISHED"
  },
  "prerequisites": {
    "competency_codes": ["FIN-BASICS-02"],
    "min_mastery_level": 0.70
  },
  "stage_assembly": [
    { "stage": 1, "stage_name": "Hook & Curiosity", "lo_ref_id": "LO-STORY-FIN-01-HOOK", "version_requirement": "^1.0.0" },
    { "stage": 2, "stage_name": "Play & Discover", "lo_ref_id": "LO-GAME-IMPULSE-SORT-01", "version_requirement": "^2.1.0" },
    { "stage": 3, "stage_name": "Concept & Scaffolding", "lo_ref_id": "LO-DIALOGUE-ASTRO-EXPLAIN-01", "version_requirement": "^1.1.0" },
    { "stage": 4, "stage_name": "Challenge & Application", "lo_ref_id": "LO-BOSS-IMPULSE-KING-01", "version_requirement": "^1.0.0" },
    { "stage": 5, "stage_name": "Reflection & Metacognition", "lo_ref_id": "LO-REFL-IMPULSE-01", "version_requirement": "^1.3.0" },
    { "stage": 6, "stage_name": "Real-World Challenge Transfer", "lo_ref_id": "LO-CHALL-TOY-WAIT-01", "version_requirement": "^1.0.0" },
    { "stage": 7, "stage_name": "Celebration & Reward", "lo_ref_id": "LO-REWARD-CRYSTAL-BADGE-01", "version_requirement": "^1.0.0" }
  ],
  "completion_criteria": {
    "min_game_score": 80,
    "reflection_completed": true,
    "challenge_accepted": true
  }
}
```

### 3.3 LX Lifecycle & State Transitions

```
[ DRAFT ] ──(Authoring/AI)──> [ IN_REVIEW ] ──(Validation Passed)──> [ APPROVED ]
                                    │                                      │
                               (Fails Check)                        (Publish Action)
                                    │                                      ▼
                                    └───────────────────────────────> [ PUBLISHED ]
                                                                           │
                                                                    (Deprecate/Supersede)
                                                                           ▼
                                                                      [ ARCHIVED ]
```

---

## PART 4: Learning Object Taxonomy

NovaStars defines **17 Core Learning Object (LO) Types**. Every object must conform to its corresponding JSON Schema contract.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      17 CORE LEARNING OBJECT TYPES                     │
├───────────────────┬────────────────────┬───────────────────────────────┤
│ 1. Story          │ 7. Boss Battle     │ 13. Feedback                  │
│ 2. Scene          │ 8. Reflection      │ 14. Competency Evidence       │
│ 3. Dialogue       │ 9. Challenge       │ 15. Learning Objective        │
│ 4. Decision Point │ 10. Assessment     │ 16. Behavior Objective        │
│ 5. NPC            │ 11. Reward         │ 17. Common Misconceptions     │
│ 6. Mini Game      │ 12. Hint           │                               │
└───────────────────┴────────────────────┴───────────────────────────────┘
```

### 4.1 Specification of the 17 Learning Object Types

#### 1. Story Object (`LO_STORY`)
* **Purpose**: Encapsulates narrative premises, thematic settings, and arc progression.
* **Input**: Target competency, theme tags, grade level.
* **Output**: Story context graph, background asset references, audio atmosphere IDs.
* **Metadata**: `story_arc_id`, `theme_category`, `moral_focus`.
* **Validation Rules**: Must contain at least 2 scenes; total narrative length must conform to age word limits (Max 300 words for Grade 1-2).
* **Owner**: Story Architect / AI Content Factory.

#### 2. Scene Object (`LO_SCENE`)
* **Purpose**: Defines visual and spatial environment container for dialogues or gameplay.
* **Input**: Story ID, environment asset keys.
* **Output**: Background layout spec, camera positioning, ambient audio IDs.
* **Metadata**: `environment_type`, `lighting_preset`, `interactive_hotspots`.
* **Validation Rules**: Background assets must exist in Asset Registry (`L4`).
* **Owner**: Instructional Designer / Art Lead.

#### 3. Dialogue Object (`LO_DIALOGUE`)
* **Purpose**: Controls character speech, voiceovers, and text rendering.
* **Input**: Character ID, emotion state, localized string tokens.
* **Output**: Dialogue text, audio file key, expression trigger.
* **Metadata**: `speaker_npc_id`, `emotion_tag`, `reading_level_score`.
* **Validation Rules**: Max 15 words per speech bubble for Grades 1-2; audio file length must match text duration within ±0.5s.
* **Owner**: Content Editor / AI Dialogue Generator.

#### 4. Decision Point Object (`LO_DECISION_POINT`)
* **Purpose**: Presents a branching choice that tests judgment or emotional response.
* **Input**: Narrative context, active options list (2-4 options).
* **Output**: User selection event, target branch node ID, risk/reward weight.
* **Metadata**: `decision_type` (Ethical, Emotional, Strategic), `competency_weight`.
* **Validation Rules**: Exactly 1 option must represent the optimal competency choice; all distractor choices must map to known misconceptions.
* **Owner**: Learning Scientist / AI Logic Engine.

#### 5. NPC Object (`LO_NPC`)
* **Purpose**: Reusable non-player character profile, visual avatar, and personality archetype.
* **Input**: Character name, archetype (Mentor, Companion, Obstacle, Specialist).
* **Output**: Visual model key, voice synthesis profile, dialogue style guide.
* **Metadata**: `character_id`, `archetype`, `voice_pitch`, `personality_traits`.
* **Validation Rules**: Character ID must be globally unique; must contain default idle and expression state assets.
* **Owner**: Story Architect / Character Artist.

#### 6. Mini Game Object (`LO_MINI_GAME`)
* **Purpose**: Interactive game mechanic simulating the skill application.
* **Input**: Game template ID, dynamic parameters JSON, difficulty rank (1-5).
* **Output**: Game telemetry stream, time elapsed, success boolean, score (0-100).
* **Metadata**: `template_id`, `mechanic_type` (Sorting, Balancing, Time-Block, Catching), `difficulty_level`.
* **Validation Rules**: Must support safe failure loops; retry loop time < 10 seconds.
* **Owner**: Educational Game Designer / Frontend Engineer.

#### 7. Boss Battle Object (`LO_BOSS_BATTLE`)
* **Purpose**: High-stakes, multi-stage assessment challenge synthesizing stage 1-3 learning.
* **Input**: Multi-competency test specs, boss profile, phase configurations.
* **Output**: Comprehensive evaluation report, stage progression token.
* **Metadata**: `boss_id`, `phase_count`, `boss_type` (Time Pressure, Resource Scarcity, Social Conflict).
* **Validation Rules**: Minimum 3 phases; must allow dynamic hint escalation if child fails phase 1 twice.
* **Owner**: Educational Game Designer / CBE Specialist.

#### 8. Reflection Object (`LO_REFLECTION`)
* **Purpose**: Prompting metacognitive awareness and self-evaluation post-challenge.
* **Input**: Metacognitive prompt, modality (Voice input, Emoji slider, Option select).
* **Output**: Child reflection payload, AI evaluation score.
* **Metadata**: `reflection_type` (Metacognitive, Emotional, Transfer), `ai_rubric_id`.
* **Validation Rules**: Voice reflections must cap at 45 seconds recording time.
* **Owner**: Learning Scientist / AI Prompt Engineer.

#### 9. Challenge Object (`LO_CHALLENGE`)
* **Purpose**: Real-world mission executed offline by child with parent supervision.
* **Input**: Target behavior, execution steps, safety guidelines.
* **Output**: Parent verification status, uploaded evidence (photo/audio/check).
* **Metadata**: `challenge_id`, `safety_rating` (Green/Yellow), `estimated_minutes` (5-15m).
* **Validation Rules**: Safety rating must be Green (zero physical risk); requires explicit parent sign-off contract.
* **Owner**: Curriculum Architect / Parent Experience Designer.

#### 10. Assessment Object (`LO_ASSESSMENT`)
* **Purpose**: Formative evaluation embedded within games, dialogues, or quizzes.
* **Input**: Item prompt, option key matrix, competency rubric.
* **Output**: Correctness score, mastery update vector.
* **Metadata**: `item_difficulty` (IRT parameters), `blooms_level` (Apply, Evaluate, Create).
* **Validation Rules**: Must map 100% of distractors to specific misconceptions in `LO_MISCONCEPTION`.
* **Owner**: Assessment Specialist / CBE Specialist.

#### 11. Reward Object (`LO_REWARD`)
* **Purpose**: Gamified incentives (Star Badges, Nova Crystals, Avatar Costumes).
* **Input**: Completion event payload, mastery threshold.
* **Output**: Inventory item unlock, celebration particle event.
* **Metadata**: `item_id`, `rarity` (Common, Rare, Epic), `badge_category`.
* **Validation Rules**: Reward values must adhere to Game Design Bible economy caps.
* **Owner**: Game Designer / Economy Architect.

#### 12. Hint Object (`LO_HINT`)
* **Purpose**: Scaffolding assistance provided upon child failure or delay.
* **Input**: Current step ID, error history array, hint level (1: Nudge, 2: Guide, 3: Direct Solution).
* **Output**: Scaffolding dialogue/visual prompt.
* **Metadata**: `hint_tier`, `trigger_delay_seconds`.
* **Validation Rules**: Tier 1 hints must be non-directive (ask a question); Tier 3 hints must never trigger on first failure.
* **Owner**: Instructional Designer / AI Tutor Engineer.

#### 13. Feedback Object (`LO_FEEDBACK`)
* **Purpose**: Immediate positive reinforcement or constructive redirection post-action.
* **Input**: Action result, strategy used, resilience metric.
* **Output**: Visual FX + voiceover praising effort and strategy.
* **Metadata**: `feedback_style` (Growth Mindset, Strategy Focus, Re-try Encourage).
* **Validation Rules**: Static praise ("You are smart!") is strictly forbidden by system linting rules.
* **Owner**: Learning Scientist / Child Psychologist.

#### 14. Competency Evidence Object (`LO_EVIDENCE`)
* **Purpose**: Standardized telemetry packet capturing observable skill demonstrability.
* **Input**: Raw telemetry, timestamp, session ID, source LO ID.
* **Output**: Formatted evidence record sent to Mastery Engine.
* **Metadata**: `evidence_type` (Game Telemetry, AI Reflection Rating, Parent Verification), `confidence_score`.
* **Validation Rules**: Must contain verifiable cryptographic hash of session state.
* **Owner**: Database Architect / Analytics Engineer.

#### 15. Learning Objective Object (`LO_LEARNING_OBJECTIVE`)
* **Purpose**: Formal definition of measurable knowledge or skill milestone.
* **Input**: Competency code, Bloom's Taxonomy verb, target metric.
* **Output**: Objective contract bound to LX.
* **Metadata**: `objective_code`, `blooms_verb`, `success_threshold`.
* **Validation Rules**: Must contain a single operational verb (e.g., "Identify", "Execute", "Categorize").
* **Owner**: Curriculum Architect.

#### 16. Behavior Objective Object (`LO_BEHAVIOR_OBJECTIVE`)
* **Purpose**: Specific observable real-world action target for real-life challenges.
* **Input**: Target real-world setting (Home, School, Public space), observable action string.
* **Output**: Observable checklist item for parent dashboard.
* **Metadata**: `setting`, `observable_action`, `frequency_target`.
* **Validation Rules**: Must be verifiable by a non-educator parent within 3 seconds of observation.
* **Owner**: CBE Specialist / Parent Experience Designer.

#### 17. Common Misconception Object (`LO_MISCONCEPTION`)
* **Purpose**: Catalog of flawed mental models or errors typical for target age.
* **Input**: Competency code, error pattern description, root cognitive cause.
* **Output**: Remediation prompt and distractor mapping key.
* **Metadata**: `misconception_code`, `frequency_index`, `remediation_lo_ref`.
* **Validation Rules**: Must be linked to at least 1 distractor in `LO_ASSESSMENT` or `LO_DECISION_POINT`.
* **Owner**: Learning Scientist / Primary Education Specialist.

---

## PART 5: Story Architecture

### 5.1 Story Graph Structure
Stories are built as directed acyclic graphs (DAG) of reusable narrative nodes.

```
[ LO_STORY: The Impulse Monster ]
       │
       ▼
[ LO_SCENE: Toy Store Entrance ] ──(Loads)──> [ LO_NPC: Astro (Mentor) ]
       │
       ▼
[ LO_DIALOGUE: "Look at that shiny robot!" ]
       │
       ▼
[ LO_DECISION_POINT: Choice Node ]
       ├── Choice A (Impulsive) ──> [ LO_SCENE: Regret Scene ] ──> [ LO_FEEDBACK: Strategy Nudge ]
       └── Choice B (Pause & Think) ─> [ LO_SCENE: Mastery Scene ] ─> [ LO_FEEDBACK: Growth Praise ]
```

### 5.2 Dynamic Text & Variables Engine
Dialogue strings use template interpolation to inject child state dynamically:

```json
{
  "dialogue_id": "LO-DLG-FIN-01-05",
  "template_text": "Hey {{child_name}}! Remember our {{cooling_off_technique}} strategy before spending your {{currency_name}}!",
  "variable_bindings": {
    "child_name": "user.profile.first_name",
    "cooling_off_technique": "session.state.selected_strategy",
    "currency_name": "country.currency.local_name"
  }
}
```

---

## PART 6: Game Architecture

### 6.1 Mini Game Object Model
Mini Games are instantiated by supplying dynamic parameters into standardized, reusable **Game Mechanics Templates**.

```
+-------------------------------------------------------------------------+
|                  GAME MECHANIC TEMPLATE (Engine Level)                  |
|                 (e.g., Template: "Bucket & Falling Items")               |
+-------------------------------------------------------------------------+
                                     │
                                     ▼ Parameter Injection
+-------------------------------------------------------------------------+
|                     LO_MINI_GAME (Content Level)                        |
|  - Items: [Impulse Purchase (Red), Essential Need (Green)]              |
|  - Speed: 1.2x | Basket Size: Medium                                  |
|  - Competency Mapping: FIN-EMOTION-01                                   |
+-------------------------------------------------------------------------+
```

### 6.2 Parameterization Contract

```json
{
  "lo_id": "LO-GAME-IMPULSE-SORT-01",
  "template_id": "TMPL-SORT-FALLING-V2",
  "version": "2.1.0",
  "game_parameters": {
    "spawn_rate_per_sec": 0.8,
    "item_categories": [
      { "category_id": "NEED", "points": 10, "color_hex": "#4CAF50" },
      { "category_id": "WANT_IMPULSE", "points": -5, "color_hex": "#F44336" }
    ],
    "win_condition": { "type": "SCORE_THRESHOLD", "target_score": 100, "time_limit_sec": 60 },
    "safe_failure": {
      "allow_retry": true,
      "max_retries": 3,
      "hint_lo_trigger": "LO-HINT-FIN-SORT-01"
    }
  }
}
```

---

## PART 7: Boss Architecture

### 7.1 Boss Battle Object Design
Boss Battles evaluate synthesis of competencies through multi-phase challenges without introducing punitive failure.

```
[ LO_BOSS_BATTLE: The Impulse King ]
   │
   ├── PHASE 1: Identification Phase (Identify emotional triggers in 30s)
   │     └── Failure ──> Trigger Tier 1 Scaffolding Hint ──> Retry Phase 1
   │
   ├── PHASE 2: Selection Phase (Choose correct emotional regulation strategy)
   │     └── Failure ──> Trigger NPC Dialogue Assist ──> Retry Phase 2
   │
   └── PHASE 3: Execution Phase (Apply strategy in interactive simulation)
         └── Success ──> Emit LO_EVIDENCE ──> Trigger LO_REWARD
```

### 7.2 Boss Selection Matrix
The CMS dynamically selects Boss Battles based on learner telemetry:
* **High Mastery Learner**: Receives Boss Variant with reduced time limits and complex distractor choices.
* **Struggling Learner**: Receives Boss Variant with enhanced visual cues and automatic hint triggers.

---

## PART 8: Reflection Architecture

### 8.1 Reflection Types & AI Contracts

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REFLECTION MODALITIES                           │
├────────────────────┬─────────────────────┬─────────────────────────────┤
│ 1. Voice Record    │ 2. Emoji & Slider   │ 3. Strategy Choice Matrix   │
│    (AI Transcribes │    (Quantitative    │    (Qualitative Strategy    │
│    & Evaluates)    │    Self-State)      │    Selection)               │
└────────────────────┴─────────────────────┴─────────────────────────────┘
```

### 8.2 AI Reflection Evaluation Schema

```json
{
  "lo_id": "LO-REFL-IMPULSE-01",
  "reflection_prompt": "What can you do next time you feel like buying a toy immediately?",
  "evaluation_mode": "LLM_SEMANTIC_MATCH",
  "rubric": {
    "key_concepts_required": ["pause", "wait", "breathe", "ask parent", "think"],
    "min_concept_matches": 1,
    "sentiment_target": "POSITIVE_GOAL_ORIENTED"
  },
  "ai_fallback_rules": {
    "on_low_confidence": "ACCEPT_WITH_GENERIC_PRAISE",
    "safety_flag_trigger": "ROUTE_TO_PARENT_ALERT"
  }
}
```

---

## PART 9: Challenge Architecture

### 9.1 Real-World Challenge Architecture
Challenges bridge digital gameplay to physical life skills.

```
[ LO_CHALLENGE: 24-Hour Toy Wait ]
   │
   ├── Child Action: Wants a toy at market -> Applies 24h wait rule.
   ├── Parent Dashboard Notification: "Prompt your child about their 24h wait challenge!"
   └── Verification Event: Parent taps "Verified Success" in Parent App.
```

### 9.2 Challenge Candidate Selection Algorithm
To prevent context mismatch, LX selects 1 Challenge from a candidate pool based on metadata tags:

```json
{
  "lo_challenge_pool": [
    { "challenge_id": "CHALL-TOY-STORE-01", "tags": ["urban", "shopping_mall", "has_allowance"] },
    { "challenge_id": "CHALL-SNACK-WAIT-02", "tags": ["universal", "home", "zero_cost"] }
  ],
  "selection_rule": "MATCH_FIRST(user.profile.environment_tags, DEFAULT='CHALL-SNACK-WAIT-02')"
}
```

---

## PART 10: Evidence Architecture

### 10.1 Competency Evidence Object Schema
Competency Evidence captures multi-channel mastery data points.

```json
{
  "evidence_id": "EVID-20260803-USR9982-FIN01",
  "timestamp": "2026-08-03T14:32:00Z",
  "learner_id": "USR-998231",
  "competency_code": "FIN-EMOTION-01",
  "evidence_source": "HYBRID",
  "telemetry_data": {
    "mini_game_score": 92,
    "reflection_ai_score": 0.85,
    "parent_verification": true
  },
  "mastery_delta": +0.12,
  "confidence_weight": 0.95
}
```

---

## PART 11: Universal Metadata System

Every Learning Object and Learning Experience in NovaStars must contain the **27 Universal Metadata Fields**.

| # | Field Name | Type | Description / Rationale |
|---|---|---|---|
| 1 | `id` | UUID / String | Globally unique object identifier. |
| 2 | `title` | String | Human-readable name for CMS search. |
| 3 | `description` | String | Internal summary of educational intent. |
| 4 | `target_competency_code` | String | Primary LSCAF code link. |
| 5 | `secondary_competency_codes` | Array[String] | Supporting competency links. |
| 6 | `age_range` | Tuple[Int, Int] | Target age bounds (e.g., `[6, 8]`). |
| 7 | `grade` | Int | Target school grade (1-5). |
| 8 | `difficulty_level` | Int (1-5) | Relative cognitive load scale. |
| 9 | `estimated_duration_sec` | Int | Expected execution time in seconds. |
| 10 | `pattern_id` | String | NLAS Learning Pattern reference. |
| 11 | `tags` | Array[String] | Content indexing & search keywords. |
| 12 | `language` | String (ISO 639-1) | Language code (e.g., `vi`, `en`). |
| 13 | `country` | String (ISO 3166-1) | Country localization target (e.g., `VN`, `US`). |
| 14 | `version` | SemVer String | Object version (`MAJOR.MINOR.PATCH`). |
| 15 | `author` | String | Author ID or AI Agent signature. |
| 16 | `status` | Enum | `DRAFT`, `IN_REVIEW`, `APPROVED`, `PUBLISHED`, `ARCHIVED`. |
| 17 | `review_status` | Enum | `PENDING`, `PASSED`, `NEEDS_REVISION`. |
| 18 | `approval_status` | Enum | `UNAPPROVED`, `PEDAGOGY_APPROVED`, `FINAL_APPROVED`. |
| 19 | `ai_generated` | Boolean | True if created by AI Content Factory. |
| 20 | `ai_reviewed` | Boolean | True if passed automated AI quality checks. |
| 21 | `dependencies` | Array[ObjectRef] | Required sub-objects or assets. |
| 22 | `prerequisites` | Array[CompRef] | Required prior mastery levels. |
| 23 | `learning_objectives` | Array[LO_Ref] | Bound learning objective IDs. |
| 24 | `behavior_objectives` | Array[BO_Ref] | Bound behavior objective IDs. |
| 25 | `common_misconceptions` | Array[MISC_Ref] | Linked misconception codes. |
| 26 | `replayability_score` | Int (1-5) | Dynamic variability metric. |
| 27 | `localization_parent_id` | String | Reference to root master object if localized. |

---

## PART 12: Content Relationships & Graph Model

### 12.1 Entity Relationship Diagram

```
 +------------------+           1:N           +---------------------+
 |    Competency    | ──────────────────────> | Learning Experience |
 +------------------+                         +---------------------+
                                                         │ 1:N (Composition)
                                                         ▼
                                              +---------------------+
                                              |   Learning Object   |
                                              +---------------------+
                                                 │       │       │
                                    1:N (Agg)   │       │       │ 1:N (Dependency)
                                  ┌─────────────┘       │       └─────────────┐
                                  ▼                     ▼                     ▼
                          +---------------+     +---------------+     +---------------+
                          |    LO_SCENE   |     |  LO_MINI_GAME |     |  LO_DIALOGUE  |
                          +---------------+     +---------------+     +---------------+
                                  │                     │                     │
                                  └─────────────────────┼─────────────────────┘
                                                        │ N:M
                                                        ▼
                                                +---------------+
                                                |   L4_ASSETS   |
                                                +---------------+
```

### 12.2 Relationship Types
* **Composition**: LX owns Learning Objects; deleting an LX manifest unlinks its assembly sequence without destroying independent LOs.
* **Aggregation**: Story Objects aggregate Scene Objects.
* **Dependency**: Mini Games depend on specific UI Asset keys.
* **Inheritance**: Localized Objects inherit properties from master Root Objects.

---

## PART 13: Versioning & Dependency Strategy

### 13.1 Semantic Versioning Standard
* **MAJOR (`X.0.0`)**: Breaking pedagogical or parameter schema changes (requires LX update).
* **MINOR (`0.Y.0`)**: Backwards-compatible content enhancements or asset upgrades.
* **PATCH (`0.0.Z`)**: Typo fixes, minor audio adjustments, localization tweaks.

### 13.2 Dependency Resolution Algorithm

```
                  ┌─────────────────────────────────────┐
                  │ LX Manifest Requests LO-GAME ^2.0.0  │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
           ┌──────────────────────────────────────────────────┐
           │ Query CMS Database for Latest LO-GAME v2.X.X      │
           └──────────────────┬───────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
  [ Found LO-GAME v2.3.1 ]                [ No Compatible v2.X.X ]
          │                                       │
  (Execute Latest v2.3.1)                 (Fallback to Pins v2.0.0 & Alert)
```

---

## PART 14: AI Integration & Micro-Generation Architecture

AI Content Factory operates exclusively at the **Learning Object Level**, never generating monolithic lessons directly.

```
+-------------------------------------------------------------------------+
|                          AI CONTENT FACTORY                             |
+-------------------------------------------------------------------------+
       │                     │                     │                     │
       ▼                     ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Generate    │      │  Generate    │      │  Tune Game   │      │  Evaluate    │
│  LO_DIALOGUE │      │  LO_SCENE    │      │  Parameters  │      │  Reflection  │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
       │                     │                     │                     │
       └─────────────────────┴──────────┬──────────┴─────────────────────┘
                                        │
                                        ▼
                       +---------------------------------+
                       | Automated Quality Guard (Part 16)|
                       +---------------------------------+
```

---

## PART 15: CMS Architecture Requirements

### 15.1 Core CMS Functional Modules
1. **Visual Graph Editor**: Node-based UI for wiring LX 7-stage sequences and story branches.
2. **Global Asset & LO Search**: Faceted search filtering across all 27 metadata fields.
3. **Localization Studio**: Side-by-side translation and audio sync management.
4. **AI Generation Workspace**: Prompt engineering workspace for generating object candidates.
5. **Version & Rollback Manager**: One-click rollback to prior compatible object releases.

---

## PART 16: Content Quality & Validation Framework

Before any Learning Object or LX moves to `APPROVED`, it must clear the **10-Point Automated Validation Matrix**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   10-POINT AUTOMATED VALIDATION MATRIX                 │
├──────────────────────────────────┬─────────────────────────────────────┤
│ 1. Completeness Validation       │ 6. Localization Readiness           │
│ 2. Competency Alignment Check    │ 7. Version Integrity Check          │
│ 3. Educational Quality Linter    │ 8. Object Contract Integrity        │
│ 4. System Consistency Check      │ 9. Dependency Graph Check           │
│ 5. Reuse Potential Index         │ 10. AI Safety & Guardrails Audit    │
└──────────────────────────────────┴─────────────────────────────────────┘
```

---

## PART 17: Architectural Scalability System

### 17.1 Scaling to 10,000+ Lessons
* **Decoupled Datastores**: Metadata indexed in Elasticsearch/Algolia; JSON documents stored in Cloud Firestore/MongoDB; raw binaries served via CDN.
* **Template Reusability**: 10,000+ LX manifests generated from ~50 core Mini Game templates and ~100 Story Archetypes.
* **Multi-Region & Multi-Language**: Zero schema modification needed to add new country codes (`TH`, `ID`, `JP`) or languages.

---

## PART 18: Authoritative Domain Glossary

* **Learning Experience (LX)**: The executable 7-stage lesson manifest uniting learning objects into a cohesive learner journey.
* **Learning Object (LO)**: An independent, reusable building block containing pedagogical logic, metadata, and parameters.
* **Asset (L4)**: Platform-agnostic raw media file (art, audio, animation).
* **Competency (LSCAF)**: Observable life skill targeted for mastery.
* **NLAS**: NovaStars Lesson Architecture System defining the 7-stage instructional blueprint.

---

## PART 19: Decision Log & Architectural Trade-offs

### 19.1 Key Architectural Decisions

#### Decision 1: Strict Decoupling of LX Manifests from Learning Objects
* **Rationale**: Allows independent updating of story dialogues or game difficulty without republishing the overarching lesson container.
* **Trade-off**: Increases database query complexity during initial lesson assembly (mitigated by CDN edge caching of compiled LX manifests).

#### Decision 2: Micro-Generation by AI at Object Level
* **Rationale**: Monolithic lesson generation leads to hallucination and poor pedagogical alignment. Object-level generation ensures strict quality control.
* **Trade-off**: Requires more complex orchestration logic in the AI Content Factory.

---

### Architectural Sign-Off
* **Chief Product Officer**: Approved
* **Curriculum Architect**: Approved
* **Competency-Based Education Specialist**: Approved
* **Learning Scientist**: Approved
* **AI Content Architect**: Approved
* **Database Architect**: Approved
