import json
import os
from typing import Dict, Any, Tuple

class PlanningAgent:
    def __init__(self, prompt_path: str):
        with open(prompt_path, "r", encoding="utf-8") as f:
            self.prompt_template = f.read()

    def generate_lesson_plan(self, competency_package: Dict[str, Any]) -> Dict[str, Any]:
        """Generates a structured Lesson Plan adhering strictly to NLAS specifications."""
        pkg_id = competency_package["package_id"]
        skill_name = competency_package["skill_name"]
        target_age = competency_package.get("target_age_range", "6-7")
        
        lesson_plan = {
            "lesson_id": f"LP-{pkg_id.replace('CP-', '')}",
            "package_id": pkg_id,
            "title": f"Hành trình Khám phá: {skill_name}",
            "theme_world": "Hành tinh NovaStars - Thung lũng Sáng tạo",
            "target_age_range": target_age,
            "total_duration_minutes": 20,
            "emotional_curve": [
                {"phase": "Hook", "target_emotion": "Tò mò", "intensity": 8},
                {"phase": "Practice", "target_emotion": "Thách thức nhẹ", "intensity": 6},
                {"phase": "Boss", "target_emotion": "Quyết tâm & Hồi hộp", "intensity": 9},
                {"phase": "Reflection", "target_emotion": "Tự hào & Bình yên", "intensity": 7}
            ],
            "nlas_stages": {
                "stage_1_story_hook": {
                    "duration_min": 3,
                    "synopsis": f"Bé cùng Gấu Nova phát hiện thử thách về {skill_name} tại Thung lũng Nova.",
                    "key_characters": ["Bé (Anh hùng Nova)", "Gấu Nova (Companion)"]
                },
                "stage_2_mini_game": {
                    "duration_min": 6,
                    "mechanic_type": "Kéo thả phân loại & Tương tác tình huống",
                    "pedagogical_goal": f"Luyện tập kỹ năng cơ bản về {skill_name} qua các màn chơi nhận diện."
                },
                "stage_3_boss_battle": {
                    "duration_min": 5,
                    "boss_name": "Quái vật Thói quen Xấu (Grumble)",
                    "mastery_test_concept": f"Ứng dụng tổng hợp {skill_name} để giải quyết 3 câu hỏi tình huống liên hoàn."
                },
                "stage_4_reflection": {
                    "duration_min": 3,
                    "reflection_prompt_type": "Ghi âm/Viết ngắn phản tư cá nhân cùng AI Companion"
                },
                "stage_5_challenge": {
                    "duration_min": 3,
                    "real_world_task_description": f"Thực hiện 1 hành động thực tế về {skill_name} tại nhà và chụp ảnh/nhờ phụ huynh xác nhận."
                }
            },
            "competency_coverage": [sub["code"] for sub in competency_package.get("sub_competencies", [])],
            "version": "v0.1.0-draft",
            "status": "DRAFT"
        }
        return lesson_plan


class PlanningQAAgent:
    def __init__(self, prompt_path: str):
        with open(prompt_path, "r", encoding="utf-8") as f:
            self.prompt_template = f.read()

    def audit_lesson_plan(self, competency_package: Dict[str, Any], lesson_plan: Dict[str, Any]) -> Dict[str, Any]:
        """Audits the generated Lesson Plan for compliance."""
        issues = []
        score = 100
        
        # Check competency coverage
        req_sub = {sub["code"] for sub in competency_package.get("sub_competencies", [])}
        cov_sub = set(lesson_plan.get("competency_coverage", []))
        missing = req_sub - cov_sub
        
        if missing:
            issues.append(f"Thiếu sub-competencies: {missing}")
            score -= 20 * len(missing)
            
        # Check duration
        nlas = lesson_plan.get("nlas_stages", {})
        total_calc = (
            nlas.get("stage_1_story_hook", {}).get("duration_min", 0) +
            nlas.get("stage_2_mini_game", {}).get("duration_min", 0) +
            nlas.get("stage_3_boss_battle", {}).get("duration_min", 0) +
            nlas.get("stage_4_reflection", {}).get("duration_min", 0) +
            nlas.get("stage_5_challenge", {}).get("duration_min", 0)
        )
        
        if total_calc != lesson_plan.get("total_duration_minutes", 0):
            issues.append(f"Tổng thời lượng các stage ({total_calc}m) không khớp với total_duration_minutes ({lesson_plan.get('total_duration_minutes')}m).")
            score -= 15

        passed = score >= 80 and len(missing) == 0
        
        return {
            "passed": passed,
            "score": max(0, score),
            "audit_issues": issues,
            "recommendations": ["Sẵn sàng cho Human Review Gate 1"] if passed else ["Sửa lại phân bổ thời lượng/competency"]
        }
