export function removeIfExistsByKey<T, K extends keyof T>(
  tb1: T[],
  tb2: T[],
  key: K
): T[] {
  const values = new Set(tb1.map(item => item[key]));
  return tb2.filter(item => !values.has(item[key]));
}