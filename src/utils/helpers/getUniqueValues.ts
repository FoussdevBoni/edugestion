export const getUniqueValues = <T, K extends keyof T>(
  data: T[],
  key: K
): T[K][] => {
  const seen = new Set<T[K]>();

  for (const item of data) {
    const value = item[key];
    if (value !== undefined && value !== null) {
      seen.add(value);
    }
  }

  return Array.from(seen);
};