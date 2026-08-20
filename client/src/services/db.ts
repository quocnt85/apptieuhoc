import { neon } from '@neondatabase/serverless';
import { QuestionItem, UserProfile } from '../types';

// Neon Serverless Database Service
class DatabaseService {
  private sql: ReturnType<typeof neon> | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    const dbUrl = import.meta.env.VITE_NEON_DATABASE_URL;
    if (dbUrl) {
      try {
        this.sql = neon(dbUrl);
        console.log('✅ Neon Database client initialized');
      } catch (err) {
        console.warn('⚠️ Could not initialize Neon client, falling back to local cache', err);
      }
    }

    window.addEventListener('online', () => { this.isOnline = true; });
    window.addEventListener('offline', () => { this.isOnline = false; });
  }

  // Đồng bộ kết quả làm bài lên Neon Postgres
  public async syncProgressToNeon(userId: string, questionId: string, isCorrect: boolean, scoreBonus: number): Promise<boolean> {
    if (!this.sql || !this.isOnline) {
      console.log('📦 Storing progress locally (Offline / No DB URL configured)');
      return false;
    }

    try {
      await this.sql`
        INSERT INTO student_mastery_logs (user_id, question_id, is_correct, score_bonus, created_at)
        VALUES (${userId}, ${questionId}, ${isCorrect}, ${scoreBonus}, NOW())
      `;
      return true;
    } catch (error) {
      console.error('Failed to sync log to Neon:', error);
      return false;
    }
  }

  // Tải danh sách bài học từ Neon hoặc R2 Storage
  public async fetchQuestionsFromNeon(): Promise<QuestionItem[] | null> {
    if (!this.sql || !this.isOnline) return null;

    try {
      const rows = await this.sql`
        SELECT id, domain_id, subdomain_id, domain_name_vi, subdomain_name_vi, 
               grade_level, difficulty, title, situation, character_dialogue, 
               question_type, options, advice, real_life_task
        FROM questions
        ORDER BY grade_level ASC, id ASC
        LIMIT 50
      `;
      return rows as unknown as QuestionItem[];
    } catch (error) {
      console.error('Failed to fetch questions from Neon:', error);
      return null;
    }
  }
}

export const dbService = new DatabaseService();
