import os
import json

def main():
    temp_dir = "/Users/thuy/Documents/apptieuhoc/question_bank/temp"
    output_js_path = "/Users/thuy/Documents/apptieuhoc/question_bank/questions_data.js"
    
    files = ["sub1.json", "sub2.json", "sub3.json", "sub4.json", "sub5.json"]
    
    all_questions = []
    skills_found = {}
    
    print("Loading and compiling subagent files...")
    
    for f_name in files:
        f_path = os.path.join(temp_dir, f_name)
        if not os.path.exists(f_path):
            print(f"❌ Error: File {f_name} does not exist at {f_path}!")
            return
            
        with open(f_path, 'r', encoding='utf-8') as f:
            try:
                # Strip potential trailing/leading whitespace or markdown syntax if any (just in case)
                text = f.read().strip()
                if text.startswith("```json"):
                    text = text.split("```json", 1)[1]
                if text.endswith("```"):
                    text = text.rsplit("```", 1)[0]
                text = text.strip()
                
                data = json.loads(text)
                print(f"✅ Loaded {f_name}: {len(data)} questions.")
                
                # Check data format
                for q in data:
                    skill = q.get("skill")
                    num = q.get("number")
                    
                    if not skill or not num:
                        print(f"❌ Warning: Missing skill or number in question: {q}")
                        continue
                        
                    # Track skill and questions
                    if skill not in skills_found:
                        skills_found[skill] = []
                    skills_found[skill].append(q)
                    
            except Exception as e:
                print(f"❌ Error decoding JSON in {f_name}: {str(e)}")
                return

    # Verify and process questions per skill
    compiled_db = []
    errors = []
    
    print("\nVerifying LSCAF constraints per skill...")
    
    # Exclude empty or invalid keys
    skills_found = {k: v for k, v in skills_found.items() if k}
    
    # Total unique skills
    print(f"Found {len(skills_found)} unique skills.")
    if len(skills_found) != 34:
        errors.append(f"Expected exactly 34 skills, but found {len(skills_found)}.")
        
    for skill_name, q_list in skills_found.items():
        # Sort questions by number
        q_list.sort(key=lambda x: int(x.get("number", 0)))
        
        # Verify count is 20
        if len(q_list) != 20:
            errors.append(f"Skill '{skill_name}' has {len(q_list)} questions instead of 20.")
            
        for i, q in enumerate(q_list):
            num = i + 1
            q["number"] = num
            
            # Verify correct tier mapping based on index
            expected_tier = ""
            if 1 <= num <= 4:
                expected_tier = "A - Knowledge (Biết)"
            elif 5 <= num <= 8:
                expected_tier = "B - Understanding (Hiểu)"
            elif 9 <= num <= 12:
                expected_tier = "C - Decision Making (Lựa chọn trong tình huống)"
            elif 13 <= num <= 16:
                expected_tier = "D - Judgment (Đánh giá hành vi)"
            elif 17 <= num <= 20:
                expected_tier = "E - Transfer & Reflection (Vận dụng & Phản tư)"
                
            q["tier"] = expected_tier
            
            # Create a clean unique id
            clean_skill = "".join([c for c in skill_name if c.isalnum() or c==' ']).replace(' ', '_')
            q["id"] = f"{clean_skill}_{num}"
            
            # Categorize the group based on the skill for better UI integration
            # We can map skills to their respective file groups
            q["group"] = get_group_name(skill_name)
            
            compiled_db.append(q)

    # Print error summary
    if errors:
        print(f"\n❌ Compilation failed with {len(errors)} error(s):")
        for err in errors[:10]:
            print(f"  - {err}")
        return
    else:
        print("✅ Validation successful! All constraints met.")
        
    # Write to questions_data.js
    js_content = f"// Ngân hàng câu hỏi tự động biên dịch theo Khung Novastars LSCAF\nconst QUESTIONS_DB = {json.dumps(compiled_db, ensure_ascii=False, indent=2)};"
    with open(output_js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"\n==========================================")
    print(f"Total compiled questions: {len(compiled_db)}")
    print(f"Successfully compiled database to: {output_js_path}")

def get_group_name(skill_name):
    # Mapping based on our implementation plan
    group1 = [
        "Phòng tránh và xử lý khi bị đi lạc",
        "An toàn khi tham gia các phương tiện giao thông công cộng",
        "Vui chơi an toàn dưới nắng",
        "Kĩ năng phòng tránh tai nạn thương tích do đồ vật sắc, nhọn",
        "Kĩ năng phòng, tránh nguy cơ bỏng, nóng",
        "Kĩ năng phòng tránh và thoát hiểm khi có hoả hoạn",
        "Kĩ năng phòng tránh nguy cơ bị điện giật",
        "Kĩ năng phòng tránh nguy cơ bị đuối nước"
    ]
    group2 = [
        "Quan sát", "Sắp xếp", "So sánh", "Phân loại", "Sáng tạo", "Chào hỏi"
    ]
    group3 = [
        "Giới thiệu sở thích của bản thân", "Làm việc nhóm", "Cảm xúc của bản thân", 
        "Cảm xúc của người khác", "Nói lời cảm ơn", "Ứng xử lịch sự khi đến chơi nhà bạn", "Cổ vũ, động viên"
    ]
    group4 = [
        "Chúc tết", "Kĩ năng thuyết trình", "Lắng nghe", 
        "Thể hiện sự tôn trọng với thầy cô", "Thể hiện tình yêu thương với thầy cô giáo", 
        "Chia sẻ ý tưởng", "Trách nhiệm cá nhân"
    ]
    
    if skill_name in group1:
        return "Tự chăm sóc & An toàn"
    elif skill_name in group2:
        return "An toàn & Tư duy cơ bản"
    elif skill_name in group3:
        return "Giao tiếp & Cảm xúc"
    elif skill_name in group4:
        return "Thuyết trình & Học đường"
    else:
        return "Trách nhiệm & Tự quản"

if __name__ == "__main__":
    main()
