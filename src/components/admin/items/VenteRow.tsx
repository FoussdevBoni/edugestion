// src/pages/admin/comptabilite/ventes/components/VenteRow.tsx
import { Vente } from "../../../utils/types/data";
import TableRow from "../../../components/ui/tables/TableRow";

interface VenteRowProps {
    vente: Vente;
    materiels: Record<string, string>;
    eleves: Record<string, string>;
    onAction: (vente: Vente) => void;
    onSelect?: (vente: Vente, isSelected: boolean) => void;
    isSelected?: boolean;
    selectable?: boolean;
}

export default function VenteRow({
    vente,
    materiels,
    eleves,
    onAction,
    onSelect,
    isSelected = false,
    selectable = false
}: VenteRowProps) {

    const formatMoney = (montant: number) => {
        return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR');
    };

    const handleAction = (vente: Vente) => {
        if (onAction) {
            onAction(vente);
        }
    };

    return (
        <TableRow
            item={vente}
            onAction={handleAction}
            onSelect={onSelect}
            isSelected={isSelected}
            selectable={selectable}
            actionable={true}
        >
            <td className="px-6 py-4">
                {formatDate(vente.date)}
            </td>
            <td className="px-6 py-4 font-medium">
                {materiels[vente.materielId]}
            </td>
            <td className="px-6 py-4">
                {vente.eleveId ? eleves[vente.eleveId] : "-"}
            </td>
            <td className="px-6 py-4 text-right font-mono">{vente.quantite}</td>
            <td className="px-6 py-4 text-right font-mono">{formatMoney(vente.prixUnitaire)}</td>
            <td className="px-6 py-4 text-right font-mono font-bold text-primary">
                {formatMoney(vente.total || vente.quantite * vente.prixUnitaire)}
            </td>
        </TableRow>
    );
}