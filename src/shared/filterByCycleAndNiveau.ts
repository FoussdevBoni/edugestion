import { applyFilters } from "../helpers/filterData";

type HasCycleAndNiveau = {
  niveauScolaire: string;
  cycle: string;
};

export function filterByCycleAndNiveau<T extends HasCycleAndNiveau>(
  cycleSelectionne: string,
  niveauSelectionne: string,
  data: T[]
) {
  return applyFilters(data, [
    { field: 'niveauScolaire', operator: "=", value: niveauSelectionne },
    { field: "cycle", operator: "contains", value: cycleSelectionne },
  ]);
}