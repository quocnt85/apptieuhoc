-- ==============================================================================
-- NOVASTARS DATABASE SCHEMA FOR NEON SERVERLESS POSTGRESQL (v2.0.0)
-- ==============================================================================

-- 1. Table: Users & Learner Profiles
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    grade_level INT DEFAULT 1,
    avatar VARCHAR(32) DEFAULT '🦁',
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    energy INT DEFAULT 5,
    max_energy INT DEFAULT 5,
    gems INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    parent_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: Competency Domains
CREATE TABLE IF NOT EXISTS domains (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'DOM-FIN', 'DOM-SEL'
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    icon VARCHAR(32),
    color VARCHAR(32),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: Subdomains
CREATE TABLE IF NOT EXISTS subdomains (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'SUB-FIN-SAVE'
    domain_id VARCHAR(32) REFERENCES domains(id) ON DELETE CASCADE,
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table: Questions Bank
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(64) PRIMARY KEY,
    domain_id VARCHAR(32) REFERENCES domains(id),
    subdomain_id VARCHAR(64) REFERENCES subdomains(id),
    domain_name_vi VARCHAR(255),
    subdomain_name_vi VARCHAR(255),
    grade_level INT DEFAULT 1,
    difficulty VARCHAR(32) DEFAULT 'medium',
    title VARCHAR(500) NOT NULL,
    situation TEXT NOT NULL,
    character_dialogue TEXT,
    question_type VARCHAR(64) DEFAULT 'single_choice',
    options JSONB NOT NULL,
    advice TEXT,
    real_life_task TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table: Student Mastery Logs (Lịch sử làm bài và điểm số năng lực)
CREATE TABLE IF NOT EXISTS student_mastery_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    question_id VARCHAR(64) REFERENCES questions(id),
    domain_id VARCHAR(32) REFERENCES domains(id),
    is_correct BOOLEAN NOT NULL,
    score_bonus INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for high-performance edge queries
CREATE INDEX IF NOT EXISTS idx_questions_domain_grade ON questions(domain_id, grade_level);
CREATE INDEX IF NOT EXISTS idx_mastery_logs_user ON student_mastery_logs(user_id, domain_id);
