import os
import sys
import json

# Add orchestrator directory to module path
current_dir = os.path.dirname(os.path.abspath(__file__))
pipeline_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.append(pipeline_dir)

from orchestrator.state_machine import ChiefOrchestrator, PipelineState
from orchestrator.agents import PlanningAgent, PlanningQAAgent

def run_sprint_1_test():
    print("=" * 60)
    print("🚀 NOVASTARS CONTENT PIPELINE - SPRINT 1 TEST EXECUTION")
    print("=" * 60)

    # 1. Initialize Orchestrator
    orchestrator = ChiefOrchestrator(pipeline_dir)
    print(f"✅ Initialized Chief Orchestrator. Current status: {orchestrator.current_state['status']}")

    # 2. Ingest CP-001 Package
    cp_path = os.path.join(pipeline_dir, "packages", "CP-001_input.json")
    with open(cp_path, "r", encoding="utf-8") as f:
        cp_data = json.load(f)

    success, msg = orchestrator.ingest_package(cp_data)
    print(f"📥 Package Ingestion: {msg}")
    assert success, "Package Ingestion failed!"

    # 3. Planning Agent Generation
    prompt_pa = os.path.join(pipeline_dir, "prompts", "planning_agent_prompt.txt")
    planner = PlanningAgent(prompt_pa)
    lesson_plan = planner.generate_lesson_plan(cp_data)
    print(f"✨ Planning Agent generated draft: '{lesson_plan['title']}' ({lesson_plan['lesson_id']})")

    # 4. Planning QA Audit
    prompt_pqa = os.path.join(pipeline_dir, "prompts", "planning_qa_agent_prompt.txt")
    qa_agent = PlanningQAAgent(prompt_pqa)
    qa_result = qa_agent.audit_lesson_plan(cp_data, lesson_plan)
    print(f"🔍 Planning QA Audit Score: {qa_result['score']}/100 | Passed: {qa_result['passed']}")
    assert qa_result['passed'], f"QA Audit failed with issues: {qa_result['audit_issues']}"

    # 5. Register Draft in Orchestrator
    success, msg = orchestrator.register_lesson_plan(lesson_plan)
    print(f"📝 Registration: {msg}")
    assert success, "Lesson Plan Registration failed!"

    # 6. Human Review Gate 1 Approval
    print("\n--- HUMAN REVIEW GATE 1 SIMULATION ---")
    reviewer = "Lead_Pedagogy_Editor_01"
    comments = "Kế hoạch bài học cấu trúc xuất sắc, đáp ứng 100% NLAS 5 stages và phân bổ thời lượng 20 phút hợp lý."
    
    approved, msg = orchestrator.human_approve_gate_1(reviewer, comments)
    print(f"👍 Human Approval: {msg}")
    assert approved, "Human approval failed!"

    # 7. Verification of Frozen State
    assert orchestrator.current_state["status"] == PipelineState.FROZEN_PLAN_V1
    frozen_hash = orchestrator.current_state["hashes"]["lesson_plan_v1"]
    print(f"🔒 State Locked! Status: {orchestrator.current_state['status']}")
    print(f"🔑 SHA-256 Hash: {frozen_hash}")
    
    frozen_file = os.path.join(pipeline_dir, "packages", "LP-001_FROZEN_v1.0.0.json")
    assert os.path.exists(frozen_file), f"Frozen file missing: {frozen_file}"
    print(f"📦 Frozen artifact verified at: {frozen_file}")

    print("=" * 60)
    print("🎉 SPRINT 1 TEST PASSED 100% SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_sprint_1_test()
