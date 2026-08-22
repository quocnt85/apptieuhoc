export const PARENT_DEMO_PASSWORDS = ['1234', '123456'] as const;

export const isParentDemoPassword = (value: string): boolean =>
  PARENT_DEMO_PASSWORDS.some((password) => password === value);

export const isParentDemoPasswordLength = (value: string): boolean =>
  PARENT_DEMO_PASSWORDS.some((password) => password.length === value.length);
