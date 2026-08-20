# SYSTEM.md — NovaStars OS Architecture Manifest

```yaml
system:
  name: "NovaStars Operating System (NovaStars OS)"
  version: "1.0.0"
  architecture: "AI-Native Markdown Knowledge Graph"
  authority: "CANONICAL_SINGLE_SOURCE_OF_TRUTH"
  specification_doc: "file:///Users/thuy/.gemini/antigravity/brain/880997be-4703-43fa-8833-e4e4367473c3/novastars_os_specification.md"

domains:
  - id: "DOM-00"
    name: "HOME"
    path: "00_HOME"
    master_file: "00_HOME/index.md"
  - id: "DOM-01"
    name: "VISION"
    path: "01_VISION"
    master_file: "01_VISION/product_philosophy.md"
  - id: "DOM-02"
    name: "PRODUCT"
    path: "02_PRODUCT"
    master_file: "02_PRODUCT/product_foundation.md"
  - id: "DOM-03"
    name: "EDUCATION"
    path: "03_EDUCATION"
    master_file: "03_EDUCATION/competency_framework.md"
  - id: "DOM-04"
    name: "GAME"
    path: "04_GAME"
    master_file: "04_GAME/game_design_bible.md"
  - id: "DOM-05"
    name: "CONTENT"
    path: "05_CONTENT"
    master_file: "05_CONTENT/content_model.md"
  - id: "DOM-06"
    name: "AI"
    path: "06_AI"
    master_file: "06_AI/acs_standard.md"
  - id: "DOM-07"
    name: "ENGINEERING"
    path: "07_ENGINEERING"
    master_file: "07_ENGINEERING/technical_architecture.md"
  - id: "DOM-08"
    name: "OPERATIONS"
    path: "08_OPERATIONS"
    master_file: "08_OPERATIONS/content_factory_sop.md"
  - id: "DOM-09"
    name: "LIBRARY"
    path: "09_LIBRARY"
    master_file: "09_LIBRARY/markdown_templates/standard_page_template.md"
  - id: "DOM-10"
    name: "GLOSSARY"
    path: "10_GLOSSARY"
    master_file: "10_GLOSSARY/master_glossary.md"
  - id: "DOM-11"
    name: "ADR"
    path: "11_ADR"
    master_file: "11_ADR/adr_index.md"

rules:
  atomic_knowledge: true
  mandatory_yaml_front_matter: true
  bidirectional_linking: true
  semver_governance: true
```
