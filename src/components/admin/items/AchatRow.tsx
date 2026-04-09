// src/pages/admin/materiel/components/AchatRow.tsx
import { Achat } from "../../../utils/types/data";
import TableRow from "../../../components/ui/tables/TableRow"; // Ajustez le chemin selon votre structure

interface AchatRowProps {
  achat: Achat;
  materiels: Record<string, string>;
  onAction: (achat: Achat) => void;
  onSelect?: (achat: Achat, isSelected: boolean) => void;
  isSelected?: boolean;
  selectable?: boolean;
}

export default function AchatRow({ 
  achat, 
  materiels, 
  onAction,
  onSelect,
  isSelected = false,
  selectable = false
}: AchatRowProps) {

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  // Gestionnaire d'action personnalisé (pour le menu à 3 points)
  const handleAction = (achat: Achat) => {
    if (onAction) {
      onAction(achat);
    }
  };

  return (
    <TableRow
      item={achat}
      onAction={handleAction}
      onSelect={onSelect}
      isSelected={isSelected}
      selectable={selectable}
      actionable={true} 
    >
      <td className="px-6 py-4">
        {formatDate(achat.date)}
      </td>
      <td className="px-6 py-4 font-medium">
        {materiels[achat.materielId]}
      </td>
      <td className="px-6 py-4 text-right font-mono">{achat.quantite}</td>
      <td className="px-6 py-4 text-right font-mono">{formatMoney(achat.prixUnitaire)}</td>
      <td className="px-6 py-4 text-right font-mono font-bold text-primary">
        {formatMoney(achat.total || achat.quantite * achat.prixUnitaire)}
      </td>
    
    </TableRow>
  );
}