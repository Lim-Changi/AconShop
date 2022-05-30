export const ProductStatus = {
  Success: 1,
  Fail: 2,
  Pending: 3,
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];
