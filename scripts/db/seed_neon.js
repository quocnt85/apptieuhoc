/**
 * Script nạp dữ liệu câu hỏi vào Neon Serverless PostgreSQL
 * Chạy lệnh: NEON_DATABASE_URL="postgres://..." node scripts/db/seed_neon.js
 */

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.NEON_DATABASE_URL;

if (!dbUrl) {
  console.error('❌ Lỗi: Vui lòng thiết lập biến môi trường NEON_DATABASE_URL');
  console.log('Ví dụ: $env:NEON_DATABASE_URL="postgres://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"');
  process.exit(1);
}

const sql = neon(dbUrl);

async function runSeed() {
  console.log('🚀 Đang kết nối tới Neon PostgreSQL...');

  try {
    // 1. Chạy file schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await sql(schemaSql);
    console.log('✅ Đã khởi tạo cấu trúc bảng thành công!');

    // 2. Chèn 5 Miền năng lực chuẩn
    const domains = [
      { id: 'DOM-FIN', vi: 'Tài chính & Quản lý Tài nguyên', en: 'Financial & Resource Literacy', icon: '💰', color: '#fbbf24', desc: 'Tiết kiệm, chi tiêu thông minh, hiểu giá trị lao động.' },
      { id: 'DOM-SEL', vi: 'Trí tuệ Cảm xúc & Xã hội', en: 'Emotional & Social Intelligence', icon: '❤️', color: '#f43f5e', desc: 'Nhận diện cảm xúc, tự chủ và xây dựng tình bạn lành mạnh.' },
      { id: 'DOM-CRT', vi: 'Tư duy Phản biện & Sáng tạo', en: 'Critical Thinking & Problem Solving', icon: '🧠', color: '#8b5cf6', desc: 'Suy luận logic, giải quyết vấn đề và tư duy phản biện.' },
      { id: 'DOM-DIG', vi: 'Công dân Số & An toàn Mạng', en: 'Digital Citizenship & Safety', icon: '🛡️', color: '#06b6d4', desc: 'Bảo vệ quyền riêng tư, an toàn trực tuyến và giao tiếp văn minh.' },
      { id: 'DOM-HAB', vi: 'Tự quản lý & Thói quen Tốt', en: 'Self-Management & Daily Habits', icon: '🌱', color: '#10b981', desc: 'Kỷ luật bản thân, thói quen sinh hoạt và quản lý thời gian.' }
    ];

    for (const d of domains) {
      await sql`
        INSERT INTO domains (id, name_vi, name_en, icon, color, description)
        VALUES (${d.id}, ${d.vi}, ${d.en}, ${d.icon}, ${d.color}, ${d.desc})
        ON CONFLICT (id) DO UPDATE SET name_vi = ${d.vi}, description = ${d.desc}
      `;
    }
    console.log('✅ Đã nạp 5 Miền năng lực chuẩn.');

    console.log('🎉 Hoàn tất seed dữ liệu lên Neon PostgreSQL thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi seed dữ liệu:', err);
  }
}

runSeed();
