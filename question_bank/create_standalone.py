import os

def main():
    base_dir = "/Users/thuy/Documents/apptieuhoc"
    html_path = os.path.join(base_dir, "review.html")
    js_path = os.path.join(base_dir, "question_bank/questions_data.js")
    standalone_path = os.path.join(base_dir, "review_standalone.html")
    
    if not os.path.exists(html_path) or not os.path.exists(js_path):
        print("Error: review.html or questions_data.js not found.")
        return
        
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
        
    # Replace the script tag
    target_tag = '<script src="question_bank/questions_data.js"></script>'
    
    if target_tag in html_content:
        replacement = f"<script>\n{js_content}\n</script>"
        standalone_content = html_content.replace(target_tag, replacement)
        
        with open(standalone_path, 'w', encoding='utf-8') as f:
            f.write(standalone_content)
        print(f"✅ Standalone HTML successfully created at: {standalone_path}")
    else:
        print("❌ Error: Target script tag not found in review.html.")

if __name__ == "__main__":
    main()
