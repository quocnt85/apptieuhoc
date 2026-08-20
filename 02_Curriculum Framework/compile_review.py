import os
import json

def compile_review_dashboard():
    # Base paths
    base_dir = "/Users/thuy/Documents/apptieuhoc"
    cf_dir = os.path.join(base_dir, "02_Curriculum Framework")
    output_file = os.path.join(base_dir, "framework_review.html")
    
    # Verify file paths and load Markdown content
    ucf_path = os.path.join(cf_dir, "UNIVERSAL_COMPETENCY_FRAMEWORK.md")
    st_path = os.path.join(cf_dir, "SKILL_TEMPLATE.md")
    ds_path = os.path.join(cf_dir, "DATABASE_SCHEMA.md")
    
    if not (os.path.exists(ucf_path) and os.path.exists(st_path) and os.path.exists(ds_path)):
        print("Error: Missing markdown framework files. Make sure UNIVERSAL_COMPETENCY_FRAMEWORK.md, SKILL_TEMPLATE.md, and DATABASE_SCHEMA.md exist.")
        return
        
    print("Reading markdown contents...")
    with open(ucf_path, "r", encoding="utf-8") as f:
        ucf_content = f.read()
        
    with open(st_path, "r", encoding="utf-8") as f:
        st_content = f.read()
        
    with open(ds_path, "r", encoding="utf-8") as f:
        ds_content = f.read()
        
    # Serialize to JSON strings to prevent javascript escaping errors
    ucf_json = json.dumps(ucf_content, ensure_ascii=False)
    st_json = json.dumps(st_content, ensure_ascii=False)
    ds_json = json.dumps(ds_content, ensure_ascii=False)
    
    print("Compiling framework_review.html...")
    
    # We use a raw string and .replace() to avoid f-string escaping errors with JS braces and templates
    html_template = r"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novastars - Competency Framework & Skill Template Review Dashboard</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
    
    <!-- Marked.js for Markdown Parsing -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        :root {
            --bg-primary: #f8fafc;
            --bg-sidebar: #ffffff;
            --bg-card: #ffffff;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --accent-color: #58cc02;
            --accent-hover: #46a302;
            --border-color: #e2e8f0;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --sidebar-width: 340px;
            --toc-width: 260px;
            --transition-speed: 0.25s;
            
            /* Brand colors */
            --brand-green: #58cc02;
            --brand-yellow: #ffc800;
            --brand-blue: #1899d6;
            --brand-orange: #ff9600;
        }

        [data-theme="dark"] {
            --bg-primary: #0f172a;
            --bg-sidebar: #1e293b;
            --bg-card: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --accent-color: #58cc02;
            --accent-hover: #67eb05;
            --border-color: #334155;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            display: flex;
            height: 100vh;
            overflow: hidden;
            transition: background-color var(--transition-speed), color var(--transition-speed);
        }

        /* Sidebar Styling */
        .sidebar {
            width: var(--sidebar-width);
            background-color: var(--bg-sidebar);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            height: 100%;
            z-index: 10;
            box-shadow: var(--shadow-sm);
            transition: background-color var(--transition-speed), border-color var(--transition-speed);
        }

        .sidebar-header {
            padding: 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo i {
            color: var(--brand-green);
            font-size: 26px;
            filter: drop-shadow(0 2px 4px rgba(88, 204, 2, 0.2));
        }

        .logo h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: var(--text-primary);
        }

        .logo span {
            color: var(--brand-blue);
        }

        .theme-toggle {
            background: none;
            border: 1px solid var(--border-color);
            width: 40px;
            height: 40px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-primary);
            transition: all var(--transition-speed);
        }

        .theme-toggle:hover {
            background-color: var(--bg-primary);
            border-color: var(--accent-color);
            color: var(--accent-color);
        }

        .search-container {
            padding: 16px 24px;
            position: relative;
            border-bottom: 1px solid var(--border-color);
        }

        .search-input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-size: 14px;
            outline: none;
            transition: all var(--transition-speed);
        }

        .search-input:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(88, 204, 2, 0.15);
        }

        .search-icon {
            position: absolute;
            left: 38px;
            top: 25px;
            color: var(--text-secondary);
        }

        .nav-list {
            list-style: none;
            padding: 16px 20px;
            overflow-y: auto;
            flex-grow: 1;
        }

        .nav-section-title {
            font-family: 'Outfit', sans-serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--text-secondary);
            margin: 20px 0 10px 10px;
            font-weight: 700;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 12px;
            cursor: pointer;
            margin-bottom: 8px;
            transition: all var(--transition-speed);
            font-size: 14px;
            font-weight: 500;
            color: var(--text-secondary);
        }

        .nav-item i {
            font-size: 18px;
            width: 20px;
            text-align: center;
        }

        .nav-item:hover {
            background-color: var(--bg-primary);
            color: var(--text-primary);
        }

        .nav-item.active {
            background-color: rgba(88, 204, 2, 0.12);
            color: var(--accent-color);
            font-weight: 600;
        }

        .nav-item.active i {
            color: var(--accent-color);
        }

        /* Main Content Styling */
        .content-area {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
            position: relative;
        }

        .content-header {
            padding: 24px 40px;
            background-color: var(--bg-sidebar);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background-color var(--transition-speed), border-color var(--transition-speed);
        }

        .content-title-wrapper {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .content-title-wrapper i {
            font-size: 24px;
            color: var(--accent-color);
        }

        .content-title-text {
            font-family: 'Outfit', sans-serif;
            font-size: 20px;
            font-weight: 800;
            color: var(--text-primary);
        }

        .content-body {
            display: flex;
            flex-direction: row;
            flex-grow: 1;
            overflow: hidden;
            position: relative;
        }

        .markdown-wrapper {
            flex-grow: 1;
            padding: 40px;
            overflow-y: auto;
            scroll-behavior: smooth;
        }

        .markdown-body {
            max-width: 820px;
            margin: 0 auto 100px auto;
            line-height: 1.7;
            font-size: 16px;
            color: var(--text-primary);
        }

        /* Right Sidebar for Table of Contents */
        .toc-container {
            width: var(--toc-width);
            border-left: 1px solid var(--border-color);
            background-color: var(--bg-sidebar);
            padding: 30px 24px;
            overflow-y: auto;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            transition: all var(--transition-speed);
        }

        .toc-title {
            font-family: 'Outfit', sans-serif;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--text-secondary);
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .toc-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .toc-item {
            font-size: 13px;
            color: var(--text-secondary);
            cursor: pointer;
            transition: color var(--transition-speed);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
        }

        .toc-item:hover {
            color: var(--accent-color);
        }

        .toc-item.h2 {
            padding-left: 0;
            font-weight: 500;
        }

        .toc-item.h3 {
            padding-left: 12px;
            font-size: 12.5px;
            color: var(--text-secondary);
            opacity: 0.85;
        }

        /* Premium Markdown Styles */
        .markdown-body h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 24px;
            margin-top: 10px;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 12px;
            color: var(--text-primary);
        }

        .markdown-body h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 22px;
            font-weight: 700;
            margin-top: 40px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px dashed var(--border-color);
            color: var(--text-primary);
        }

        .markdown-body h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 17px;
            font-weight: 600;
            margin-top: 28px;
            margin-bottom: 12px;
            color: var(--text-primary);
        }

        .markdown-body p {
            margin-bottom: 18px;
            color: var(--text-secondary);
        }

        .markdown-body ul, .markdown-body ol {
            margin-bottom: 20px;
            padding-left: 24px;
            color: var(--text-secondary);
        }

        .markdown-body li {
            margin-bottom: 8px;
        }

        .markdown-body hr {
            border: 0;
            height: 1px;
            background: var(--border-color);
            margin: 40px 0;
        }

        /* Glassmorphism details */
        .markdown-body blockquote {
            border-left: 4px solid var(--accent-color);
            padding: 16px 24px;
            background: rgba(88, 204, 2, 0.04);
            border-radius: 0 16px 16px 0;
            margin-bottom: 24px;
            font-style: italic;
        }

        /* Markdown tables */
        .markdown-body table {
            width: 100%;
            border-collapse: collapse;
            margin: 28px 0;
            font-size: 15px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        .markdown-body th, .markdown-body td {
            border: 1px solid var(--border-color);
            padding: 14px 18px;
            text-align: left;
        }

        .markdown-body th {
            background-color: rgba(88, 204, 2, 0.05);
            font-weight: 600;
            color: var(--text-primary);
        }

        .markdown-body tr:nth-child(even) td {
            background-color: rgba(0, 0, 0, 0.01);
        }

        /* Code highlight */
        .markdown-body code {
            background-color: rgba(88, 204, 2, 0.08);
            padding: 3px 6px;
            border-radius: 6px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: #d63384;
        }

        .markdown-body pre {
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            overflow-x: auto;
            margin-bottom: 24px;
            border: 1px solid #334155;
            box-shadow: var(--shadow-md);
        }

        .markdown-body pre code {
            background: none;
            padding: 0;
            color: #e2e8f0;
            font-size: 14px;
        }

        /* Mermaid placeholder */
        .mermaid {
            background-color: var(--bg-sidebar);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            overflow-x: auto;
        }

        /* Search highlights */
        .highlight {
            background-color: rgba(255, 200, 0, 0.35);
            border-radius: 4px;
            padding: 1px 3px;
        }

        /* Bouncy effect */
        .bouncy-hover {
            transition: transform 0.1s ease;
        }
        .bouncy-hover:active {
            transform: scale(0.96);
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .toc-container {
                display: none;
            }
        }

        @media (max-width: 768px) {
            body {
                flex-direction: column;
            }
            .sidebar {
                width: 100%;
                height: auto;
            }
            .nav-list {
                max-height: 200px;
            }
        }
    </style>
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <i class="fa-solid fa-layer-group"></i>
                <h1>NovaStars <span>CF</span></h1>
            </div>
            <button class="theme-toggle bouncy-hover" onclick="toggleTheme()" title="Đổi giao diện">
                <i class="fa-solid fa-moon" id="theme-icon"></i>
            </button>
        </div>

        <div class="search-container">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" class="search-input" id="search" placeholder="Tìm kiếm trong framework..." oninput="handleSearch()">
        </div>

        <ul class="nav-list" id="nav-list">
            <div class="nav-section-title">Hệ Thống Năng Lực</div>
            <li class="nav-item active bouncy-hover" onclick="switchDoc('universal_framework')" id="nav-universal_framework">
                <i class="fa-solid fa-shield-halved"></i> Tầng 1 - UCF (Khung Chung)
            </li>
            <li class="nav-item bouncy-hover" onclick="switchDoc('skill_template')" id="nav-skill_template">
                <i class="fa-solid fa-file-invoice"></i> Tầng 2 - Skill Template
            </li>
            <li class="nav-item bouncy-hover" onclick="switchDoc('database_schema')" id="nav-database_schema">
                <i class="fa-solid fa-database"></i> Kiến Trúc Dữ Liệu
            </li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="content-area">
        <div class="content-header">
            <div class="content-title-wrapper">
                <i class="fa-solid fa-circle-check" id="header-icon"></i>
                <div class="content-title-text" id="header-title">Khung Năng Lực Chung</div>
            </div>
        </div>

        <div class="content-body">
            <div class="markdown-wrapper" id="markdown-wrapper">
                <div class="markdown-body" id="doc-content">
                    <!-- Dynamic rendering -->
                </div>
            </div>

            <!-- Table of Contents Sidebar -->
            <div class="toc-container">
                <div class="toc-title">
                    <i class="fa-solid fa-list-ul"></i> Mục Lục
                </div>
                <ul class="toc-list" id="toc-list">
                    <!-- TOC elements generated dynamically -->
                </ul>
            </div>
        </div>
    </div>

    <script>
        // Directly embedded from compiled markdown
        const docs = {
            universal_framework: {{UNIVERSAL_FRAMEWORK_JSON}},
            skill_template: {{SKILL_TEMPLATE_JSON}},
            database_schema: {{DATABASE_SCHEMA_JSON}}
        };

        // Theme management
        function toggleTheme() {
            const body = document.body;
            const icon = document.getElementById('theme-icon');
            const currentTheme = body.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                icon.className = 'fa-solid fa-moon';
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                icon.className = 'fa-solid fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        }

        // Initialize theme from storage
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('theme-icon').className = 'fa-solid fa-sun';
        }

        // Switch displayed document
        let activeDocId = 'universal_framework';
        
        function switchDoc(docId) {
            // Remove active classes
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            
            // Add active class
            document.getElementById(`nav-${docId}`).classList.add('active');
            activeDocId = docId;
            
            // Update title & icon
            const titleText = document.getElementById('header-title');
            const iconEl = document.getElementById('header-icon');
            if (docId === 'universal_framework') {
                titleText.innerText = 'Tầng 1 - Universal Competency Framework';
                iconEl.className = 'fa-solid fa-shield-halved';
            } else if (docId === 'skill_template') {
                titleText.innerText = 'Tầng 2 - Skill Template & Example';
                iconEl.className = 'fa-solid fa-file-invoice';
            } else if (docId === 'database_schema') {
                titleText.innerText = 'Kiến Trúc Dữ Liệu & Lược Đồ';
                iconEl.className = 'fa-solid fa-database';
            }
            
            // Render markdown content
            renderContent(docs[docId]);
            document.getElementById('markdown-wrapper').scrollTop = 0;
        }

        function renderContent(mdText) {
            const contentDiv = document.getElementById('doc-content');
            
            // Parse Markdown to HTML via marked.js
            contentDiv.innerHTML = marked.parse(mdText);
            
            // Generate Table of Contents (TOC)
            generateTOC();
        }

        function generateTOC() {
            const tocList = document.getElementById('toc-list');
            tocList.innerHTML = '';
            
            const contentDiv = document.getElementById('doc-content');
            // Get h2 and h3 elements
            const headings = contentDiv.querySelectorAll('h2, h3');
            
            headings.forEach((heading, index) => {
                const text = heading.innerText;
                const tag = heading.tagName.toLowerCase();
                
                // Create unique ID for heading anchor
                const anchorId = `heading-anchor-${activeDocId}-${index}`;
                heading.setAttribute('id', anchorId);
                
                const li = document.createElement('li');
                li.className = `toc-item ${tag}`;
                li.innerText = text;
                li.onclick = () => {
                    heading.scrollIntoView({ behavior: 'smooth' });
                };
                
                tocList.appendChild(li);
            });

            if (headings.length === 0) {
                const li = document.createElement('li');
                li.className = 'toc-item';
                li.innerText = 'Không có mục lục';
                li.style.cursor = 'default';
                tocList.appendChild(li);
            }
        }

        // Simple Search over all documents
        function handleSearch() {
            const query = document.getElementById('search').value.toLowerCase().trim();
            if (!query) {
                switchDoc(activeDocId); // Restore normal view
                return;
            }
            
            // Search inside the current document and highlight
            const currentMD = docs[activeDocId];
            
            // We do a simple HTML parsing and text replace
            const rawHTML = marked.parse(currentMD);
            
            // Create dummy element to query text nodes without breaking HTML tags
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawHTML;
            
            highlightTextNodes(tempDiv, query);
            
            document.getElementById('doc-content').innerHTML = tempDiv.innerHTML;
            generateTOC();
        }

        function highlightTextNodes(element, query) {
            const children = Array.from(element.childNodes);
            
            children.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue;
                    if (text.toLowerCase().includes(query)) {
                        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                        const span = document.createElement('span');
                        span.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
                        node.parentNode.replaceChild(span, node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.tagName !== 'CODE') {
                    highlightTextNodes(node, query);
                }
            });
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        // Init load
        switchDoc('universal_framework');
    </script>
</body>
</html>"""

    # Do placeholders replacement
    compiled_html = html_template.replace("{{UNIVERSAL_FRAMEWORK_JSON}}", ucf_json)
    compiled_html = compiled_html.replace("{{SKILL_TEMPLATE_JSON}}", st_json)
    compiled_html = compiled_html.replace("{{DATABASE_SCHEMA_JSON}}", ds_json)
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(compiled_html)
    
    print(f"Success! Dashboard compiled at {output_file}")

if __name__ == "__main__":
    compile_review_dashboard()
