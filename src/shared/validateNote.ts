export const validateNote = (value: number | null): number | null => {
  if (value === null) return null;
  if (value > 20) return 20;
  if (value < 0) return 0;
  return value;
};