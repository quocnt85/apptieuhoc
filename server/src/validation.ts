import { z } from 'zod';

export const emailSchema = z.string().trim().email().max(320);
export const pinSchema = z.string().regex(/^\d{6}$/);
export const otpSchema = z.string().regex(/^\d{6}$/);
export const uuidSchema = z.string().uuid();
export const idempotencySchema = z.string().min(8).max(128).regex(/^[A-Za-z0-9._:-]+$/);
export const positiveIntegerSchema = z.number().int().positive().safe();

export const registerSchema = z.object({
  email: emailSchema,
  policyVersion: z.string().min(1).max(64).default('parent-zone-v1.2.0'),
  marketingConsent: z.boolean().default(false),
});

export const verifyEmailSchema = z.object({ email: emailSchema, otp: otpSchema });
export const setupPinSchema = z.object({ pin: pinSchema });
export const verifyPinSchema = z.object({ pin: pinSchema });
export const requestPinResetSchema = z.object({ email: emailSchema });
export const confirmPinResetSchema = z.object({ email: emailSchema, otp: otpSchema, newPin: pinSchema });
export const createChildSlotSchema = z.object({ idempotencyKey: idempotencySchema });
export const rewardApprovalSchema = z.object({
  rewardRequestId: idempotencySchema,
  childSlotId: uuidSchema,
  diamonds: z.number().int().min(0).safe(),
});
export const itemPurchaseSchema = z.object({
  purchaseRequestId: idempotencySchema,
  childSlotId: uuidSchema,
  sku: z.string().min(2).max(128).regex(/^[a-z0-9._:-]+$/),
});

export const revenueCatWebhookSchema = z.object({
  event: z.object({
    id: z.string().min(1).max(255),
    type: z.string().min(1).max(64),
    app_user_id: z.string().min(1).max(255),
    product_id: z.string().min(1).max(255),
    transaction_id: z.string().max(255).nullish(),
    original_transaction_id: z.string().max(255).nullish(),
    entitlement_ids: z.array(z.string()).nullish(),
    purchased_at_ms: z.number().int().nullish(),
    expiration_at_ms: z.number().int().nullish(),
    will_renew: z.boolean().nullish(),
  }),
});
