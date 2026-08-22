import type { AppBindings } from './bindings';
import { AppError } from './errors';

export type OtpPurpose = 'verify_email' | 'reset_pin' | 'login';

const purposeLabel: Record<OtpPurpose, string> = {
  verify_email: 'xác minh email',
  reset_pin: 'đặt lại mã PIN',
  login: 'đăng nhập',
};

export const sendOtpEmail = async (
  env: AppBindings,
  to: string,
  otp: string,
  purpose: OtpPurpose,
): Promise<{ delivered: boolean; mode: 'binding' | 'console' | 'disabled' }> => {
  if (env.EMAIL_DELIVERY_MODE !== 'binding') {
    return { delivered: false, mode: env.EMAIL_DELIVERY_MODE === 'disabled' ? 'disabled' : 'console' };
  }
  if (!env.EMAIL) throw new AppError(503, 'EMAIL_BINDING_UNAVAILABLE', 'Dịch vụ email chưa được cấu hình.');

  const label = purposeLabel[purpose];
  await env.EMAIL.send({
    to,
    from: { email: env.EMAIL_FROM, name: 'NovaStars Security' },
    subject: `Mã ${label} NovaStars`,
    text: `Mã ${label} của bạn là ${otp}. Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.`,
    html: `<p>Mã ${label} của bạn là:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.</p>`,
  });
  return { delivered: true, mode: 'binding' };
};
