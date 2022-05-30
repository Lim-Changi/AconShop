export const UserRole = {
  CUSTOMER: 1,
  AUTHOR: 2,
  EDITOR: 3,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
