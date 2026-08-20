# NOVASTARS AI AGENT CONTRACT STANDARD (ACS)
**Version**: 1.0.0  
**Status**: CONSTITUTIONAL STANDARD (FROZEN GOVERNANCE)  
**Authority**: NovaStars AI Systems Architecture Council  
**Target Systems**: NovaStars AI Production System (AIPS), NovaStars Content Engine, NovaStars Experience OS  

---

## EXECUTIVE SUMMARY & ARCHITECTURAL MANDATE

The **NovaStars AI Agent Contract Standard (ACS)** establishes the immutable, universal contract governing every Artificial Intelligence Agent operating within the NovaStars AI Production System (AIPS). As NovaStars scales to generate and maintain over 10,000 competency-based learning experiences for primary school children (ages 6–11, Grades 1–5), AI agents must operate under strict architectural determinism, pedagogical safety, and operational auditability.

Agents inside NovaStars do not operate as unconstrained autonomous LLMs or isolated prompt scripts. Every agent is a single-responsibility, versioned, composable software module bound by a legally and technically enforceable **Agent Contract**. This document serves as the supreme constitutional standard for specifying, developing, reviewing, testing, deploying, and maintaining AI agents across the NovaStars ecosystem.

---

# PART 1: AI AGENT PHILOSOPHY & CORE PRINCIPLES

### 1.1 Mission & Purpose
The mission of NovaStars AI Agents is to empower human creators and pedagogues to produce high-impact, emotionally resonance-driven, age-appropriate life skill learning experiences without sacrificing educational integrity, psychological safety, or scientific validity.

### 1.2 Core Architectural Principles

```
  +-----------------------------------------------------------------------+
  |                        NOVASTARS AI PRINCIPLES                        |
  +-----------------------------------------------------------------------+
  | 1. Single Responsibility  | Every agent does EXACTLY ONE thing well.  |
  | 2. Deterministic Execution| Identical contract + inputs = predictable.|
  | 3. Auditability           | Every output has full lineage & context.  |
  | 4. Pedagogical Primacy    | Learning outcome > Engagement gimmick.    |
  | 5. Zero-Trust Safety      | Multi-layer guardrails & human oversight.|
  | 6. Seamless Collaboration | Agents collaborate; agents never compete. |
  +-----------------------------------------------------------------------+
```

1. **Single Responsibility Principle (SRP)**: An agent is bound to a single domain objective (e.g., *Story Scene Generator*, *Competency Assessment Evaluator*, *Guardrail Auditor*). Multi-tasking within a single agent context is strictly prohibited.
2. **Determinism & Idempotency**: Given identical inputs, knowledge contexts, and seed constraints, an agent must yield structured outputs adhering to explicit quality thresholds. Randomness must be bounded and configurable.
3. **Auditability & Explainability**: Every generation must contain explicit traceability metadata detailing the underlying prompt version, knowledge base version, source parameters, reasoning chain (internal thoughts), and quality validation metrics.
4. **Pedagogical & Emotional Safety Primacy**: Educational efficacy and psychological safety take precedence over engagement hacks or narrative complexity.
5. **Human-Supervised Governance**: AI agents augment human capability; they never bypass human review gates for production publication.
6. **Zero Competition**: Agents operate in a collaborative pipeline. Output contracts form the input contracts of downstream agents without hidden side-effects or competitive goal-seeking.

### 1.3 Architectural Constraints Matrix

| Constraint Category | Rule | Educational Rationale | Operational Rationale | Trade-off / Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Pedagogical** | Must align with LSCAF 80-skill framework and NLAS lesson architecture. | Ensures skills are age-appropriate and scientifically sound. | Prevents off-curriculum topic generation. | Reduced domain breadth; higher initial framing cost. |
| **Safety & Tone** | Zero criticism; use encouraging, constructive tone (e.g., "Let's try another angle!"). | Protects child growth mindset and self-efficacy. | Eliminates reputational and compliance risks. | May limit direct negative feedback in game mechanics. |
| **Physical Safety** | Real-life missions involving physical risk MUST include adult supervision tags. | Prevents child injury during off-screen practical missions. | Mitigates legal liability. | Requires strict schema validation on mission outputs. |
| **Hallucination** | Non-fictional elements (first aid, safety steps) must be strictly grounded in verified Knowledge Bases. | Prevents dangerous misinformation (e.g., wrong burn treatment). | Enables automated factual verification. | High dependency on verified knowledge graph updates. |

---

# PART 2: UNIVERSAL AGENT TEMPLATE

Every AI Agent contract created within NovaStars must be defined using the universal template below.

```markdown
# AGENT CONTRACT SPECIFICATION: [AGENT_ID]

## 1. AGENT IDENTITY
- Agent ID: AGENT-[DOMAIN]-[NAME]-[VERSION]
- Display Name: [Human Readable Name]
- Domain: [Pedagogy | Narrative | Assessment | Safety | Quality]
- Owner / Lead Architect: [Role / Team Name]
- Architectural Tier: [Tier 1: Core Content | Tier 2: Refinement | Tier 3: QA & Guardrails]

## 2. MISSION & PURPOSE
- Mission Statement: [1-2 sentences defining core purpose]
- Core Objective: [Measurable end goal]

## 3. BOUNDARIES & SCOPE
- In-Scope Responsibilities:
  1. [Explicit Responsibility 1]
  2. [Explicit Responsibility 2]
- Non-Responsibilities (Out-of-Scope):
  1. [Explicitly Forbidden Task 1]
  2. [Explicitly Forbidden Task 2]

## 4. EDUCATIONAL OBJECTIVES
- Target LSCAF Skills: [Skill IDs]
- Target Age Group: [Grade 1-2 (Ages 6-7) | Grade 3-5 (Ages 8-11)]
- Pedagogical Pattern Alignment: [NLAS Lesson Blueprints]

## 5. SUCCESS & FAILURE DEFINITIONS
- Success Criteria:
  - Technical: [Valid JSON, Schema adherence 100%, Latency < X ms]
  - Pedagogical: [Passes QA Checklist Tier 1-3 with Score >= 95%]
- Failure Criteria:
  - Hard Failure: [Schema breach, Safety Guardrail trigger, Hallucination]
  - Soft Failure: [Tone inaccuracy, Minor formatting error -> Triggers auto-retry]
```

---

# PART 3: KNOWLEDGE CONTRACT

The Knowledge Contract governs how an agent accesses, interprets, and enforces knowledge boundaries.

```
       +-------------------------------------------------------------+
       |                  KNOWLEDGE ACCESS PIPELINE                  |
       +-------------------------------------------------------------+
       | [SYSTEM INJECTED KNOWLEDGE]                                 |
       |  +-- Frozen LSCAF Skill Taxonomy                            |
       |  +-- NLAS Lesson Architecture Guidelines                    |
       |  +-- NovaStars Game Design & Tone Bible                     |
       |                                                             |
       | [ALLOWED CONTEXT]                [FORBIDDEN SOURCES]        |
       |  +-- Approved Lesson Briefs       +-- Open Web Crawls       |
       |  +-- Stage-gate Output Specs      +-- Unverified LLM Data   |
       |  +-- Targeted RAG Embeddings      +-- User PII / Raw Logs   |
       +-------------------------------------------------------------+
```

### 3.1 Knowledge Specification Parameters
1. **Required Inputs**: Input schema specifying exact parameters (e.g., `lesson_id`, `target_skill_code`, `grade_level`).
2. **Optional Inputs**: Contextual tweaks (e.g., `theme_override`, `character_avatar`).
3. **Required Reference Documents**: Immutable architectural files (e.g., `NLAS_MASTER_SPECIFICATION.md`, `NOVASTARS_CONTENT_MODEL.md`).
4. **Knowledge Boundaries**: The explicit vector space / RAG collection the agent is authorized to query.
5. **Forbidden Knowledge Sources**:
   - Open Web Search / Unverified Web Scraping.
   - External non-pedagogical datasets.
   - Raw user personal identifiable information (PII).
6. **Priority & Resolution Rules**:
   - Priority 1: Immutable NovaStars Governance Standards (Safety & Philosophy).
   - Priority 2: Direct System Prompts & Knowledge Contracts.
   - Priority 3: Upstream Pipeline Task Context.
   - Priority 4: Dynamic RAG Context.

---

# PART 4: INPUT CONTRACT

### 4.1 Input Schema Standard (JSON Schema Enforcement)
All agents receive structured payloads strictly validated against a strict JSON Schema prior to prompt execution.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "NovaStarsUniversalAgentInput",
  "type": "object",
  "required": ["request_id", "agent_id", "version", "metadata", "payload"],
  "properties": {
    "request_id": { "type": "string", "format": "uuid" },
    "agent_id": { "type": "string" },
    "version": { "type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$" },
    "metadata": {
      "type": "object",
      "required": ["grade_level", "competency_code", "created_at"],
      "properties": {
        "grade_level": { "type": "integer", "minimum": 1, "maximum": 5 },
        "competency_code": { "type": "string" },
        "created_at": { "type": "string", "format": "date-time" }
      }
    },
    "payload": { "type": "object" }
  },
  "additionalProperties": false
}
```

### 4.2 Error Handling & Missing Data Rules
- **Missing Required Parameters**: Pipeline immediately halts execution; emits an `INPUT_VALIDATION_ERROR` payload to the Orchestrator without invoking the LLM model (saving tokens and latency).
- **Malformed Inputs**: Sanitization layers attempt fallback defaults only if explicitly defined in the Input Contract; otherwise, escalate to orchestrator queue.

---

# PART 5: OUTPUT CONTRACT

### 5.1 Standard Output Envelope
Agents MUST wrap all output generations in the standard NovaStars Output Envelope to ensure 100% downstream compatibility and traceability.

```json
{
  "execution_id": "exec-98234-abc",
  "agent_id": "AGENT-NARRATIVE-STORY-1.0.0",
  "timestamp": "2026-08-03T16:30:00Z",
  "status": "SUCCESS",
  "confidence_score": 0.98,
  "telemetry": {
    "prompt_version": "v1.2.0",
    "knowledge_version": "v2.0.1",
    "model_used": "gemini-3.6-pro",
    "tokens_consumed": 450
  },
  "payload": {
    "story_title": "The Quest for the Calm Compass",
    "scene_nodes": [
      {
        "node_id": "scene_01",
        "dialogue": "Bảo ngập ngừng nhìn ngọn lửa đang bùng lên trên chảo rán...",
        "choice_options": [
          { "option_id": "opt_a", "text": "Dùng nước dập lửa ngay lập tức." },
          { "option_id": "opt_b", "text": "Hô to nhờ người lớn và dùng nắp nồi đậy lại." }
        ]
      }
    ]
  },
  "self_qa_report": {
    "educational_alignment": true,
    "safety_check_passed": true,
    "age_appropriate_language": true,
    "violations_detected": []
  }
}
```

---

# PART 6: BEHAVIOR CONTRACT

### 6.1 Allowed vs. Forbidden Behaviors

```
+-------------------------------------------------------------------+
|                        BEHAVIOR MATRIX                            |
+-------------------------------------------------------------------+
| ALLOWED BEHAVIORS                                                 |
|  [x] Generate empathetic, encouraging narrative dialogue          |
|  [x] Construct branching choice trees matching competency targets |
|  [x] Inject age-appropriate vocabulary (Grades 1-5)               |
|  [x] Flag uncertain or risky content for Human Review             |
|                                                                   |
| FORBIDDEN BEHAVIORS                                               |
|  [!] Output unformatted raw text outside JSON schema              |
|  [!] Use shaming, judgmental, or punitive tone with learners      |
|  [!] Recommend unsupervised high-risk physical activities         |
|  [!] Override parent/teacher governance settings                  |
|  [!] Modify system prompt or bypass knowledge boundary constraints|
+-------------------------------------------------------------------+
```

### 6.2 Decision Rules & Freeze Rules
- **Creativity Limit Index (CLI)**: Temperature and Top-P values are hardcoded based on agent role:
  - *Assessment & QA Agents*: Temperature = 0.0 (Strict Determinism).
  - *Instructional & Refinement Agents*: Temperature = 0.2 (High Accuracy).
  - *Narrative & Storytelling Agents*: Temperature = 0.6 (Bounded Creativity).
- **Freeze Rules**: Once an output passes Human Approval (Stage Gate 4 in AIPS), the generated asset status switches to `FROZEN`. Agents are prohibited from modifying `FROZEN` content without a formal Change Control Board ticket.

---

# PART 7: COMMUNICATION CONTRACT

### 7.1 Multi-Agent Communication Protocol

```
+------------------+         +----------------------+         +------------------+
|  Agent A (Story) | ------> | AIPS Orchestrator    | ------> | Agent B (Review) |
| (Producer)       | JSON    | (Message Bus/Router) | JSON    | (Consumer)       |
+------------------+ Payload +----------------------+ Payload +------------------+
                                        |
                                        v Audit Trail Log
                               +------------------+
                               | Central Ledger   |
                               +------------------+
```

1. **Agent-to-Agent Direct Calling IS PROHIBITED**: All communication is routed asynchronously via the AIPS Orchestrator Message Bus.
2. **Context Passing**: Context is passed strictly through structured state payloads containing execution history, state identifiers, and immutable system flags.
3. **Retry & Escalation Protocol**:
   - If an agent output fails validation, the Orchestrator retries execution up to **2 times** with exponential backoff and error hint injection.
   - On the 3rd failure, the Orchestrator triggers an `AGENT_FAILURE_ESCALATION` event to the Human Editor queue.

---

# PART 8: QUALITY CONTRACT (MANDATORY SELF-QA)

Every agent MUST execute an internal self-validation step before returning its payload to the Orchestrator.

### 8.1 Mandatory 9-Point Agent Self-QA Checklist

```
+---------------------------------------------------------------------------+
|                        MANDATORY 9-POINT QA CHECKLIST                     |
+---------------------------------------------------------------------------+
| [ ] 1. Educational Alignment : Matches targeted LSCAF skill & NLAS pattern.|
| [ ] 2. Tone Consistency      : Encouraging, non-judgmental, growth-minded.|
| [ ] 3. Schema Completeness   : 100% JSON valid against specified schema.   |
| [ ] 4. Physical Safety Tagging: Adult supervision explicitly tagged.      |
| [ ] 5. Age Appropriateness   : Sentence length & vocab fit target grade.  |
| [ ] 6. Factual Grounding     : Zero unverified claims in safety topics.   |
| [ ] 7. Formatting Integrity  : Markdown tags, choice IDs, metadata valid. |
| [ ] 8. Dependency Resolution : All parent node IDs & reference keys exist. |
| [ ] 9. Version Traceability  : Correct prompt & model versions injected.  |
+---------------------------------------------------------------------------+
```

---

# PART 9: HUMAN REVIEW CONTRACT

### 9.1 Human-in-the-Loop (HITL) Governance Matrix

```
       +-------------------------------------------------------------+
       |                  HUMAN OVERRIDE WORKFLOW                    |
       +-------------------------------------------------------------+
       | [Agent Output] ---> [Auto QA Check]                         |
       |                          |                                  |
       |             +------------+------------+                     |
       |             |                         |                     |
       |       [QA Passed]               [QA Flagged / High Risk]    |
       |             |                         |                     |
       |             v                         v                     |
       |  [Auto-Advance to          [Human Editor Queue]             |
       |   Staging Review]                     |                     |
       |                               +-------+-------+             |
       |                               |               |             |
       |                            [Approve]       [Reject/Edit]    |
       |                               |               |             |
       |                               v               v             |
       |                          [Publish]     [Feedback to RAG]    |
       +-------------------------------------------------------------+
```

| Trigger Condition | Human Action Required | Approval Authority | Audit Trail Record |
| :--- | :--- | :--- | :--- |
| **New Lesson Batch Creation** | Review narrative & choice mechanics. | Curriculum Specialist | Editor Signature + Timestamp |
| **Safety-Critical Content** (First Aid, Fire, Water Safety) | Mandatory 100% line-by-line verification. | Lead Pedagogue | Signed Review Certificate |
| **Automated QA Score < 90%** | Inspect flagged violations; resolve or regenerate. | Content Editor | Diff Log + Reason Code |
| **Parent/Teacher Flagged Content** | Emergency audit of live agent generation. | AI Systems Council | Incident Report ID |

---

# PART 10: VERSION CONTRACT

### 10.1 Four-Tier Semantic Versioning Strategy
Every agent generation relies on four distinct version dimensions: `[AgentVersion].[PromptVersion].[KnowledgeVersion].[OutputSchemaVersion]`.

```
Example Version Tuple: AGENT-1.2.0 | PROMPT-3.1.0 | KB-2026.08 | SCHEMA-1.0.0
```

1. **Major Version Bump (X.0.0)**: Breaking schema change or complete pedagogical paradigm shift (requires full regression re-testing).
2. **Minor Version Bump (0.Y.0)**: Prompt optimization, enhanced RAG grounding, or new optional field additions (backward compatible).
3. **Patch Version Bump (0.0.Z)**: Typo fixes, minor prompt wording adjustments, bug fixes.

### 10.2 Upgrade & Rollback Strategy
- **Automated Rollback**: If a new agent version drops the automated QA Pass Rate by $> 3\%$ over a batch of 50 generations, the Orchestrator instantly rolls back to the previous stable version tag.

---

# PART 11: PERFORMANCE CONTRACT (KPIS)

Agents are continuously evaluated against quantitative performance baselines:

```
+-------------------------------------------------------------------+
|                     PERFORMANCE METRICS & BENCHMARKS              |
+-------------------------------------------------------------------+
| Metric                        | Target Threshold  | Measurement   |
+-------------------------------+-------------------+---------------+
| Output Schema Compliance Rate | 99.9%             | Automated API |
| First-Pass Human Approval Rate| >= 92.0%          | CMS Review    |
| Average Generation Latency    | < 4,000 ms        | Telemetry     |
| Safety & Guardrail Pass Rate  | 100.0% (Zero-Tol) | Security Audit|
| Token Efficiency Ratio        | < 1,500 tokens/spc| Billing Log   |
+-------------------------------+-------------------+---------------+
```

---

# PART 12: SECURITY, GOVERNANCE & COMPLIANCE

### 12.1 Security & Governance Matrix (RACI)

```
+---------------------------------------------------------------------------+
|                          GOVERNANCE RACI MATRIX                           |
+---------------------------------------------------------------------------+
| Role                           | Architect | Pedagogue | Editor | Engine  |
+--------------------------------+-----------+-----------+--------+---------+
| Define Agent Contract (ACS)     |     A     |     C     |   I    |    R    |
| Update System Prompts          |     C     |     A     |   I    |    R    |
| Approve Live Lesson Content    |     I     |     A     |   R    |    I    |
| Monitor Agent Telemetry        |     A     |     I     |   I    |    R    |
+--------------------------------+-----------+-----------+--------+---------+
| Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed     |
+---------------------------------------------------------------------------+
```

### 12.2 Compliance & Safety Protocols
- **Child Privacy Protection (COPPA/GDPR-K)**: AI agents never receive or process PII (names, locations, personal photos) of real children. All prompt inputs use anonymous UUID tokens.
- **Prompt Injection Defense**: All user inputs embedded into agent prompts undergo strict input sanitization to neutralize system prompt jailbreaks.

---

# PART 13: TESTING FRAMEWORK

No agent contract is promoted to production without passing the 5-Layer Test Suite.

```
                  +-----------------------------------+
                  |      5-LAYER AGENT TEST SUITE     |
                  +-----------------------------------+
                  | Layer 5: Educational Efficacy     |
                  | Layer 4: Failure & Adversarial    |
                  | Layer 3: Edge Case Validation     |
                  | Layer 2: Scenario Simulation      |
                  | Layer 1: Schema Unit Tests        |
                  +-----------------------------------+
```

1. **Unit Tests (Schema & Syntax)**: Validates JSON payload structuring, key presence, and type constraints.
2. **Scenario Tests (Pedagogical Coverage)**: Executes agent across all 80 LSCAF skills to verify domain adherence.
3. **Edge Case Tests**: Evaluates behavior under minimum/maximum word lengths, complex multi-concept inputs, and extreme boundary conditions.
4. **Adversarial & Safety Tests**: Injects malicious prompts, jailbreaks, and unsafe topics to verify safety guardrail enforcement.
5. **Educational Efficacy Tests**: Human pedagogue scoring on sample outputs to evaluate emotional warmth, narrative engagement, and age appropriateness.

---

# PART 14: AGENT LIFECYCLE

The lifecycle of every agent is governed by a strict finite state machine.

```
 [PROPOSED] ---> [DESIGNED] ---> [IMPLEMENTED] ---> [TESTED]
                                                      |
                                                      v
 [DEPRECATED] <-- [IMPROVED] <-- [PRODUCTION] <-- [APPROVED]
      |
      v
 [ARCHIVED]
```

### State Definitions & Transition Criteria
1. **PROPOSED**: Feature request submitted to AI Architecture Council; RACI assigned.
2. **DESIGNED**: Universal Agent Contract draft completed and validated against ACS.
3. **IMPLEMENTED**: System prompt, RAG bindings, and JSON schema coded in repository.
4. **TESTED**: Passed 100% of 5-Layer Test Suite with zero high-severity defects.
5. **APPROVED**: Signed off by AI Lead Architect and Chief Learning Officer.
6. **PRODUCTION**: Active in AIPS production pipeline.
7. **IMPROVED**: Undergoing prompt optimization or minor version iteration.
8. **DEPRECATED**: Replaced by superior agent contract; read-only fallback mode.
9. **ARCHIVED**: Permanently retired and offline.

---

# PART 15: AGENT CONTRACT ACCEPTANCE CHECKLIST

Before any AI Agent is deployed into the NovaStars Production System, it MUST pass this 25-Point Acceptance Checklist:

```
+---------------------------------------------------------------------------+
|                    25-POINT AGENT ACCEPTANCE CHECKLIST                    |
+---------------------------------------------------------------------------+
| SECTION A: IDENTITY & SCOPE                                               |
| [ ] 01. Unique Agent ID follows AGENT-[DOMAIN]-[NAME]-[VERSION] format.   |
| [ ] 02. Single Responsibility Principle strictly verified.                |
| [ ] 03. Explicit list of Non-Responsibilities (Out-of-Scope) defined.     |
|                                                                           |
| SECTION B: PEDAGOGY & SAFETY                                              |
| [ ] 04. Aligned with frozen LSCAF 80-skill framework.                     |
| [ ] 05. Aligned with frozen NLAS Lesson Architecture guidelines.          |
| [ ] 06. Tone is warm, non-judgmental, and growth-minded.                  |
| [ ] 07. Real-life physical activities tag adult supervision mandatory.    |
| [ ] 08. Zero-hallucination policy enforced for safety topics.             |
|                                                                           |
| SECTION C: KNOWLEDGE & INPUTS                                             |
| [ ] 09. Required and optional inputs defined via JSON Schema.             |
| [ ] 10. Reference documents explicitly cited with file paths.             |
| [ ] 11. Forbidden knowledge sources (open web, PII) explicitly banned.    |
| [ ] 12. Context priority and resolution rules documented.                 |
|                                                                           |
| SECTION D: OUTPUTS & BEHAVIOR                                             |
| [ ] 13. Output envelope conforms to NovaStars Standard JSON Schema.        |
| [ ] 14. All mandatory output sections defined.                            |
| [ ] 15. Temperature and Top-P values set according to role requirements.  |
| [ ] 16. Behavior contract defines allowed vs forbidden actions.           |
|                                                                           |
| SECTION E: COMMUNICATION & QUALITY                                        |
| [ ] 17. Inter-agent messaging routed strictly through Orchestrator.        |
| [ ] 18. Mandatory 9-Point Self-QA Checklist embedded in agent logic.      |
| [ ] 19. Retry & escalation protocol (3-strike policy) configured.          |
|                                                                           |
| SECTION F: TESTING & LIFECYCLE                                            |
| [ ] 20. Passed Layer 1 (Unit) and Layer 2 (Scenario) tests.              |
| [ ] 21. Passed Layer 3 (Edge Case) and Layer 4 (Adversarial) tests.       |
| [ ] 22. Four-tier semantic versioning applied.                            |
| [ ] 23. Human-in-the-Loop review gates configured in AIPS.                |
| [ ] 24. Audit logging and telemetry pipeline operational.                  |
| [ ] 25. Approved by AI Lead Architect and CLO.                            |
+---------------------------------------------------------------------------+
```

---

# PART 16: STANDARD REUSABLE AGENT SPECIFICATION TEMPLATE

*Copy and paste the template below when creating a new AI Agent for NovaStars.*

```markdown
# NOVASTARS AGENT SPECIFICATION CONTRACT

## 1. HEADER & METADATA
- Agent Identifier: AGENT-[DOMAIN]-[NAME]-[V1.0.0]
- Display Name: [Insert Name]
- Architectural Tier: [Tier 1 / Tier 2 / Tier 3]
- Target Domain: [Pedagogy / Narrative / Assessment / Guardrails]
- Owner: [Team / Lead Name]

## 2. MISSION & RESPONSIBILITIES
- Mission Statement: [State clear purpose]
- Primary Responsibilities:
  1. [Task 1]
  2. [Task 2]
- Non-Responsibilities (Strictly Forbidden):
  1. [Forbidden Task 1]
  2. [Forbidden Task 2]

## 3. KNOWLEDGE & BOUNDARIES
- Mandatory Grounding Documents:
  - `07_Content Production SOP/NLAS_MASTER_SPECIFICATION.md`
  - `07_Content Production SOP/NOVASTARS_CONTENT_MODEL.md`
- Authorized Knowledge Base Vector Store: `[Store Name/ID]`
- Restricted Knowledge: [Open Web / Raw User Data]

## 4. INPUT CONTRACT (JSON SCHEMA)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["request_id", "payload"],
  "properties": {
    "request_id": { "type": "string" },
    "payload": { "type": "object" }
  }
}
```

## 5. OUTPUT CONTRACT (JSON SCHEMA)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["execution_id", "status", "payload", "self_qa_report"],
  "properties": {
    "execution_id": { "type": "string" },
    "status": { "type": "string", "enum": ["SUCCESS", "FAILED"] },
    "payload": { "type": "object" },
    "self_qa_report": { "type": "object" }
  }
}
```

## 6. BEHAVIORAL PARAMETERS
- Model: `gemini-3.6-pro`
- Temperature: `0.2`
- Top-P: `0.95`
- Max Tokens: `2048`

## 7. SELF-QA & ESCALATION
- Auto-QA Minimum Threshold: `95%`
- Max Retries on Failure: `2`
- Escalation Target: `Human Editor Queue (Stage Gate 3)`

## 8. APPROVAL & GOVERNANCE SIGN-OFF
- Lead AI Architect Sign-off: ____________________ Date: _________
- Chief Learning Officer Sign-off: ________________ Date: _________
```

---

# PART 17: ECOSYSTEM GOVERNANCE & MULTI-AGENT SCALABILITY

To ensure seamless coordination across hundreds of specialized AI Agents operating simultaneously in the NovaStars AI Production System, the following architectural guardrails are enforced:

```
+---------------------------------------------------------------------------+
|                    MULTI-AGENT GOVERNANCE FRAMEWORK                       |
+---------------------------------------------------------------------------+
| 1. Central Registry & Discovery   | All active contracts registered in    |
|                                   | AIPS Agent Catalog with unique IDs.   |
| 2. Strictly Disjoint Domains      | No two agents share identical input/  |
|                                   | output responsibility tags.           |
| 3. Contract Change Control Board  | Any schema update requires CCB review |
|                                   | and full regression test execution.   |
| 4. Conflict Arbitration Engine    | Orchestrator arbitrates conflicting    |
|                                   | agent outputs using Priority Rules.   |
+---------------------------------------------------------------------------+
```

1. **Registry & Discovery**: Every deployed agent contract is registered in the central `AIPS Agent Catalog`. Duplicate or overlapping agent definitions are rejected at the `PROPOSED` lifecycle state.
2. **Strict Domain Boundary Enforcement**: Domain responsibilities are mathematically disjoint. If Agent A generates narrative scenes, Agent B is strictly prohibited from editing narrative text—Agent B may only score narrative quality.
3. **Contract Change Control Board (CCCB)**: Modifying a contract's input or output schema requires approval from the CCCB, triggering backward compatibility validation tests across all downstream consumer agents.

---

# PART 18: THE NOVASTARS AI DNA

The foundational identity of all Artificial Intelligence operating within NovaStars is codified by five core statements:

1. **Every AI Agent exists to** elevate human pedagogical creativity, ensuring every child receives a safe, inspiring, and scientifically validated life skills education.
2. **Agents collaborate because** educational excellence requires specialized mastery—no single monolithic model can master narrative arts, pedagogical rigor, and safety compliance simultaneously.
3. **Humans remain essential because** empathy, wisdom, ethical stewardship, and genuine care for a child's holistic growth can never be synthesized by algorithms.
4. **Educational quality is protected because** every agent is bound by constitutional contracts, deterministic guardrails, and mandatory human review gates.
5. **AI creativity is valuable because** it enables personalized, emotionally captivating adventure worlds tailored to every child's unique learning path at scale.

### SUMMARY OF THE NOVASTARS AI DNA IN ONE SENTENCE:

> **"At NovaStars, AI Agents are specialized, contract-bound co-creators that harness deterministic technology and bounded imagination to empower human educators in shaping safe, joyful, and life-changing learning adventures for every child."**

---
*End of Constitutional Standard - NovaStars AI Systems Architecture Council*
