import json
import os
import hashlib
from typing import Dict, Any, Tuple

class PipelineState:
    INIT = "INIT"
    INGESTED = "INGESTED"
    PLANNING_IN_PROGRESS = "PLANNING_IN_PROGRESS"
    PLANNING_QA_IN_PROGRESS = "PLANNING_QA_IN_PROGRESS"
    WAITING_HUMAN_REVIEW_GATE_1 = "WAITING_HUMAN_REVIEW_GATE_1"
    FROZEN_PLAN_V1 = "FROZEN_PLAN_V1"
    REJECTED = "REJECTED"

class ChiefOrchestrator:
    def __init__(self, base_dir: str):
        self.base_dir = base_dir
        self.schema_dir = os.path.join(base_dir, "schemas")
        self.packages_dir = os.path.join(base_dir, "packages")
        self.state_file = os.path.join(base_dir, "pipeline_state.json")
        
        self.cp_schema = self._load_schema("competency_package_schema.json")
        self.lp_schema = self._load_schema("lesson_plan_schema.json")
        
        self.current_state = self._load_pipeline_state()

    def _load_schema(self, filename: str) -> Dict[str, Any]:
        filepath = os.path.join(self.schema_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)

    def _load_pipeline_state(self) -> Dict[str, Any]:
        if os.path.exists(self.state_file):
            with open(self.state_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "status": PipelineState.INIT,
            "package_id": None,
            "current_stage": "Stage 1: Lesson Planning",
            "active_version": "v1.0.0",
            "hashes": {},
            "history": []
        }

    def save_state(self):
        with open(self.state_file, "w", encoding="utf-8") as f:
            json.dump(self.current_state, f, indent=2, ensure_ascii=False)

    def validate_json(self, data: Dict[str, Any], schema_type: str) -> Tuple[bool, str]:
        schema = self.cp_schema if schema_type == "competency" else self.lp_schema
        required_fields = schema.get("required", [])
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: '{field}'"
        return True, "Validation successful"

    def compute_hash(self, content: Dict[str, Any]) -> str:
        serialized = json.dumps(content, sort_keys=True)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def ingest_package(self, package_data: Dict[str, Any]) -> Tuple[bool, str]:
        valid, msg = self.validate_json(package_data, "competency")
        if not valid:
            return False, f"Package ingestion failed: {msg}"
        
        pkg_id = package_data["package_id"]
        pkg_path = os.path.join(self.packages_dir, f"{pkg_id}_input.json")
        with open(pkg_path, "w", encoding="utf-8") as f:
            json.dump(package_data, f, indent=2, ensure_ascii=False)

        self.current_state["status"] = PipelineState.INGESTED
        self.current_state["package_id"] = pkg_id
        self.current_state["hashes"]["competency_package"] = self.compute_hash(package_data)
        self.current_state["history"].append(f"Ingested package {pkg_id}")
        self.save_state()
        return True, f"Successfully ingested {pkg_id}"

    def register_lesson_plan(self, plan_data: Dict[str, Any]) -> Tuple[bool, str]:
        valid, msg = self.validate_json(plan_data, "lesson")
        if not valid:
            return False, f"Lesson Plan registration failed: {msg}"

        plan_id = plan_data["lesson_id"]
        plan_path = os.path.join(self.packages_dir, f"{plan_id}_draft.json")
        with open(plan_path, "w", encoding="utf-8") as f:
            json.dump(plan_data, f, indent=2, ensure_ascii=False)

        self.current_state["status"] = PipelineState.WAITING_HUMAN_REVIEW_GATE_1
        self.current_state["history"].append(f"Registered draft Lesson Plan {plan_id}. Awaiting Human Review Gate 1.")
        self.save_state()
        return True, f"Lesson Plan {plan_id} registered and sent to Human Review Gate 1"

    def human_approve_gate_1(self, reviewer_id: str, comments: str) -> Tuple[bool, str]:
        if self.current_state["status"] != PipelineState.WAITING_HUMAN_REVIEW_GATE_1:
            return False, f"Cannot approve Gate 1 in current status: {self.current_state['status']}"

        pkg_id = self.current_state["package_id"]
        plan_id = f"LP-{pkg_id.replace('CP-', '')}"
        draft_path = os.path.join(self.packages_dir, f"{plan_id}_draft.json")
        frozen_path = os.path.join(self.packages_dir, f"{plan_id}_FROZEN_v1.0.0.json")

        with open(draft_path, "r", encoding="utf-8") as f:
            plan_data = json.load(f)

        plan_data["status"] = "FROZEN"
        plan_data["version"] = "v1.0.0"

        with open(frozen_path, "w", encoding="utf-8") as f:
            json.dump(plan_data, f, indent=2, ensure_ascii=False)

        frozen_hash = self.compute_hash(plan_data)
        self.current_state["status"] = PipelineState.FROZEN_PLAN_V1
        self.current_state["hashes"]["lesson_plan_v1"] = frozen_hash
        self.current_state["history"].append(
            f"Gate 1 APPROVED by {reviewer_id}. Comments: '{comments}'. State locked as v1.0.0 Hash: {frozen_hash[:10]}..."
        )
        self.save_state()
        return True, f"Gate 1 Approved. Lesson Plan frozen as {frozen_path}"

    def human_reject_gate_1(self, reviewer_id: str, feedback: str) -> Tuple[bool, str]:
        self.current_state["status"] = PipelineState.REJECTED
        self.current_state["history"].append(f"Gate 1 REJECTED by {reviewer_id}. Feedback: '{feedback}'")
        self.save_state()
        return True, f"Gate 1 Rejected. Feedback logged: {feedback}"
