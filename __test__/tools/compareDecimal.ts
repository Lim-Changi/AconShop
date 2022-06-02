export const compareDecimal = (
  val1: string | number,
  val2: string | number,
): boolean => {
  return Math.floor(Number(val1) * 100) === Math.floor(Number(val2) * 100);
};
