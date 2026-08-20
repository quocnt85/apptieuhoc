import os
import re

def verify_markdown_file(file_path):
    print(f"\nVerifying {os.path.basename(file_path)}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find all questions (e.g. ### Câu 1: or ### Câu 100:)
    questions = re.findall(r'### Câu (\d+): (.*?)(?=\n### Câu|\Z)', content, re.DOTALL)
    
    if not questions:
        print("❌ No questions found in this file.")
        return False
        
    print(f"Found {len(questions)} questions.")
    
    errors = []
    question_numbers = []
    
    for q_num_str, q_body in questions:
        q_num = int(q_num_str)
        question_numbers.append(q_num)
        
        # Check for Options A, B, C, D
        has_a = "*   A." in q_body or "* A." in q_body or "A." in q_body
        has_b = "*   B." in q_body or "* B." in q_body or "B." in q_body
        has_c = "*   C." in q_body or "* C." in q_body or "C." in q_body
        has_d = "*   D." in q_body or "* D." in q_body or "D." in q_body
        
        if not (has_a and has_b and has_c and has_d):
            errors.append(f"Question {q_num} is missing one or more options (A, B, C, D)")
            
        # Check for Correct Answer
        has_correct = "**Đáp án đúng:**" in q_body or "Đáp án đúng:" in q_body
        if not has_correct:
            errors.append(f"Question {q_num} is missing Correct Answer ('Đáp án đúng')")
            
        # Check for Explanation
        has_explanation = "**Giải thích:**" in q_body or "Giải thích:" in q_body
        if not has_explanation:
            errors.append(f"Question {q_num} is missing Explanation ('Giải thích')")
            
    # Check if question numbers are consecutive
    for idx, num in enumerate(question_numbers):
        if idx > 0 and num != question_numbers[idx-1] + 1:
            # Check if it resets per subject
            if num != 1:
                errors.append(f"Non-consecutive question numbering: {question_numbers[idx-1]} -> {num}")
                
    if errors:
        print(f"❌ Verification failed with {len(errors)} error(s):")
        for err in errors[:10]:  # Show first 10 errors
            print(f"  - {err}")
        if len(errors) > 10:
            print(f"  - ...and {len(errors) - 10} more errors")
        return False
    else:
        print("✅ All questions in this file are correctly formatted with Options A-D, Correct Answer, and Explanation.")
        return True

def main():
    bank_dir = "/Users/thuy/Documents/apptieuhoc/question_bank"
    files = [
        "group1_self_care_safety.md",
        "group2_self_management.md",
        "group3_thinking_learning.md",
        "group4_communication_collaboration.md",
        "group5_responsibility.md",
        "group6_financial_digital.md"
    ]
    
    all_success = True
    total_questions = 0
    for f in files:
        file_path = os.path.join(bank_dir, f)
        if os.path.exists(file_path):
            success = verify_markdown_file(file_path)
            if not success:
                all_success = False
            # Count questions using standard file reading to check totals
            with open(file_path, 'r', encoding='utf-8') as file_obj:
                text = file_obj.read()
                total_questions += len(re.findall(r'### Câu \d+:', text))
        else:
            print(f"❌ File not found: {f}")
            all_success = False
            
    print(f"\n==========================================")
    print(f"Total questions verified: {total_questions}")
    if all_success:
        print("🎉 Verification completed successfully! All files are perfectly formatted.")
    else:
        print("⚠️ Verification finished with some formatting errors. Please inspect the logs above.")

if __name__ == "__main__":
    main()
