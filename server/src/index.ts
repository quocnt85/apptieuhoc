import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { neon } from '@neondatabase/serverless';

export interface Env {
  NEON_DATABASE_URL: string;
  CONTENT_BUCKET: R2Bucket;
  ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for Web App & Capacitor Native Shell
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: c.env.ENVIRONMENT || 'development',
  });
});

// GET /api/v1/questions - Lấy danh sách câu hỏi từ Neon Database
app.get('/api/v1/questions', async (c) => {
  try {
    const dbUrl = c.env.NEON_DATABASE_URL;
    if (!dbUrl) {
      return c.json({ error: 'Neon Database URL not configured' }, 500);
    }

    const sql = neon(dbUrl);
    const domainId = c.req.query('domainId');
    const grade = c.req.query('grade');

    let rows;
    if (domainId && grade) {
      rows = await sql`
        SELECT * FROM questions 
        WHERE domain_id = ${domainId} AND grade_level = ${Number(grade)}
        ORDER BY id ASC LIMIT 50
      `;
    } else if (domainId) {
      rows = await sql`
        SELECT * FROM questions 
        WHERE domain_id = ${domainId}
        ORDER BY id ASC LIMIT 50
      `;
    } else {
      rows = await sql`
        SELECT * FROM questions 
        ORDER BY grade_level ASC, id ASC LIMIT 50
      `;
    }

    return c.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// POST /api/v1/progress - Ghi nhận nhật ký làm bài của học sinh lên Neon DB
app.post('/api/v1/progress', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, questionId, domainId, isCorrect, scoreBonus } = body;

    const dbUrl = c.env.NEON_DATABASE_URL;
    if (!dbUrl) {
      return c.json({ error: 'Database URL not configured' }, 500);
    }

    const sql = neon(dbUrl);
    await sql`
      INSERT INTO student_mastery_logs (user_id, question_id, domain_id, is_correct, score_bonus, created_at)
      VALUES (${userId}, ${questionId}, ${domainId}, ${isCorrect}, ${scoreBonus}, NOW())
    `;

    return c.json({ success: true, message: 'Progress saved successfully' });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// GET /api/v1/content/:packageId - Lấy gói bài học JSON từ Cloudflare R2
app.get('/api/v1/content/:packageId', async (c) => {
  try {
    const packageId = c.req.param('packageId');
    const objectKey = `lessons/${packageId}.json`;

    const object = await c.env.CONTENT_BUCKET.get(objectKey);
    if (!object) {
      return c.json({ error: `Package '${packageId}' not found in R2` }, 404);
    }

    const data = await object.json();
    return c.json({ success: true, data });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// POST /api/v1/content/upload - Đẩy gói bài học đã đóng băng (Frozen) lên R2
app.post('/api/v1/content/upload', async (c) => {
  try {
    const body = await c.req.json();
    const { packageId, content } = body;

    if (!packageId || !content) {
      return c.json({ error: 'Missing packageId or content' }, 400);
    }

    const objectKey = `lessons/${packageId}.json`;
    await c.env.CONTENT_BUCKET.put(objectKey, JSON.stringify(content), {
      httpMetadata: { contentType: 'application/json' }
    });

    return c.json({
      success: true,
      message: `Uploaded package ${packageId} to R2 successfully`,
      key: objectKey,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
