import os
import re
import json

def parse_markdown_file(file_path, group_name):
    print(f"Parsing {os.path.basename(file_path)}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Split content by markdown headers to find Topics
    # Pattern to find topic titles: ## CHỦ ĐỀ (\d+): (.*?)\n
    topics = re.findall(r'## (CHỦ ĐỀ \d+): (.*?)\n', content)
    
    # Let's split the file content by topics or read sequentially to keep track of current topic
    lines = content.split('\n')
    current_topic = "Chủ đề mặc định"
    
    questions = []
    
    # We will parse the file using a state-machine or line-by-line reading to associate each question with its current topic
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if line defines a topic
        topic_match = re.match(r'^## (CHỦ ĐỀ \d+:.*?)$', line)
        if topic_match:
            current_topic = topic_match.group(1).strip()
            # Clean up theme descriptions like *(Bao gồm...)*
            current_topic = re.sub(r'\s*\(\*Bao gồm.*?\*\)\s*', '', current_topic)
            current_topic = re.sub(r'\s*\(\*.*?\*\)\s*', '', current_topic)
            i += 1
            continue
            
        # Check if line defines a question
        q_match = re.match(r'^### Câu (\d+):\s*(.*)$', line)
        if q_match:
            q_num = int(q_match.group(1))
            q_text = q_match.group(2).strip()
            
            # Read subsequent lines until we get all components of the question
            options = {}
            correct_ans = ""
            explanation = ""
            
            i += 1
            while i < len(lines):
                next_line = lines[i].strip()
                # If we encounter next question or next topic, stop reading this question
                if next_line.startswith('### Câu') or next_line.startswith('## '):
                    i -= 1 # Step back so outer loop processes it
                    break
                    
                # Parse options
                opt_match = re.match(r'^\*\s+([A-D])\.\s*(.*)$', next_line)
                if opt_match:
                    options[opt_match.group(1)] = opt_match.group(2).strip()
                    
                # Parse correct answer
                ans_match = re.match(r'^\*\s+\*\*Đáp án đúng:\*\*\s*([A-D])$', next_line)
                if not ans_match:
                    ans_match = re.match(r'^\*\s+Đáp án đúng:\s*([A-D])$', next_line)
                if ans_match:
                    correct_ans = ans_match.group(1).strip()
                    
                # Parse explanation
                exp_match = re.match(r'^\*\s+\*\*Giải thích:\*\*\s*(.*)$', next_line)
                if not exp_match:
                    exp_match = re.match(r'^\*\s+Giải thích:\s*(.*)$', next_line)
                if exp_match:
                    explanation = exp_match.group(1).strip()
                    # Read multiline explanation if any
                    while i + 1 < len(lines) and lines[i+1].strip() and not lines[i+1].strip().startswith('###') and not lines[i+1].strip().startswith('*') and not lines[i+1].strip().startswith('##'):
                        i += 1
                        explanation += " " + lines[i].strip()
                        
                i += 1
                
            # Store question
            questions.append({
                'id': f"{group_name.replace(' ', '_')}_{q_num}",
                'number': q_num,
                'question': q_text,
                'options': options,
                'answer': correct_ans,
                'explanation': explanation,
                'topic': current_topic,
                'group': group_name
            })
            
        i += 1
        
    print(f"Parsed {len(questions)} questions for group: {group_name}")
    return questions

def main():
    bank_dir = "/Users/thuy/Documents/apptieuhoc/question_bank"
    groups = {
        "group1_self_care_safety.md": "Tự chăm sóc & An toàn cá nhân",
        "group2_self_management.md": "Nhận thức & Quản lý bản thân",
        "group3_thinking_learning.md": "Tư duy & Học tập thế kỷ 21",
        "group4_communication_collaboration.md": "Giao tiếp & Hợp tác xã hội",
        "group5_responsibility.md": "Trách nhiệm & Sự chính trực",
        "group6_financial_digital.md": "Quản lý tài chính & An toàn số"
    }
    
    db = []
    for filename, group_name in groups.items():
        file_path = os.path.join(bank_dir, filename)
        if os.path.exists(file_path):
            questions = parse_markdown_file(file_path, group_name)
            db.extend(questions)
            
    # Write to questions_data.js
    output_js_path = os.path.join(bank_dir, "questions_data.js")
    js_content = f"// Ngân hàng câu hỏi tự động trích xuất từ tài liệu kỹ năng tiểu học\nconst QUESTIONS_DB = {json.dumps(db, ensure_ascii=False, indent=2)};"
    
    with open(output_js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"\n==========================================")
    print(f"Total questions written: {len(db)}")
    print(f"Output file: {output_js_path}")

if __name__ == "__main__":
    main()
