
type Operator =
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "contains"
  | "startsWith"
  | "endsWith";

type FilterCondition<T> = {
  field: keyof T;
  value: any;
  operator?: Operator;
};

export function applyFilters<T>(
  data: T[],
  filters: FilterCondition<T>[]
): T[] {
  return data.filter((item) => {
    return filters.every(({ field, value, operator = "=" }) => {
      const itemValue = item[field];

      switch (operator) {
        case "=":
          return itemValue === value;

        case "!=":
          return itemValue !== value;

        case ">":
          return itemValue > value;

        case ">=":
          return itemValue >= value;

        case "<":
          return itemValue < value;

        case "<=":
          return itemValue <= value;

        case "contains":
          return typeof itemValue === "string" &&
            itemValue.toLowerCase().includes(String(value).toLowerCase());

        case "startsWith":
          return typeof itemValue === "string" &&
            itemValue.toLowerCase().startsWith(String(value).toLowerCase());

        case "endsWith":
          return typeof itemValue === "string" &&
            itemValue.toLowerCase().endsWith(String(value).toLowerCase());

        default:
          return false;
      }
    });
  });
}