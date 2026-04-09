// src/components/admin/lists/BulletinRow.tsx
import { AlertTriangle, CheckCircle, Clock, Edit } from "lucide-react";
import { useState } from "react";
import { Bulletin } from "../../../utils/types/data";
import TableRow from "../../ui/tables/TableRow";

interface BulletinRowProps {
  bulletin: Bulletin;
  onAction: (bulletin: Bulletin) => void;
  onSelect?: (bulletin: Bulletin, isSelected: boolean) => void;
  isSelected?: boolean;
  selectable?: boolean;
  onUpdateConduite?: (bulletinId: string, conduite: number) => Promise<void>;
}

const STATUS_CONFIG = {
  brouillon: { color: "bg-gray-100 text-gray-700", icon: Clock, label: "Brouillon" },
  incomplet: { color: "bg-orange-100 text-orange-700", icon: AlertTriangle, label: "Incomplet" },
  a_finaliser: { color: "bg-yellow-100 text-yellow-700", icon: Edit, label: "À finaliser" },
  complet: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Complet" }
};

export default function BulletinRow({
  bulletin,
  onAction,
  onSelect,
  isSelected = false,
  selectable = false,
  onUpdateConduite
}: BulletinRowProps) {
  const statusInfo = STATUS_CONFIG[bulletin.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.brouillon;
  const StatusIcon = statusInfo.icon;

  const [isEditingConduite, setIsEditingConduite] = useState(false);
  const [conduiteValue, setConduiteValue] = useState(bulletin?.vieScolaire?.conduite?.toString() || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConduiteClick = () => {
    if (onUpdateConduite) {
      setIsEditingConduite(true);
    }
  };

  const handleConduiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Autoriser uniquement les nombres entre 0 et 20
    if (value === "" || (/^\d{1,2}$/.test(value) && parseInt(value) <= 20)) {
      setConduiteValue(value);
    }
  };

  const handleConduiteBlur = async () => {
    if (!onUpdateConduite) return;

    const newValue = parseInt(conduiteValue);
    const oldValue = bulletin?.vieScolaire?.conduite;

    // Ne pas sauvegarder si la valeur n'a pas changé ou est invalide
    if (conduiteValue === "" || isNaN(newValue) || newValue === oldValue) {
      setIsEditingConduite(false);
      setConduiteValue(oldValue?.toString() || "");
      return;
    }

    // Valider que la note est entre 0 et 20
    if (newValue < 0 || newValue > 20) {
      setConduiteValue(oldValue?.toString() || "");
      setIsEditingConduite(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateConduite(bulletin.id, newValue);
      setIsEditingConduite(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la conduite:", error);
      setConduiteValue(oldValue?.toString() || "");
      setIsEditingConduite(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConduiteBlur();
    } else if (e.key === 'Escape') {
      setIsEditingConduite(false);
      setConduiteValue(bulletin?.vieScolaire?.conduite?.toString() || "");
    }
  };

  return (
    <TableRow
      item={bulletin}
      onAction={onAction}
      onSelect={onSelect}
      isSelected={isSelected}
      selectable={selectable}
      actionable={true}
    >
      <td className="px-6 py-4">
        <div className="font-medium">{bulletin.eleve?.prenom} {bulletin.eleve?.nom}</div>
        <div className="text-sm text-gray-500">{bulletin.eleve?.matricule}</div>
      </td>
      <td className="px-6 py-4">{bulletin.eleve?.classe}</td>
      <td className="px-6 py-4">
        <span className="font-mono font-bold text-primary">
          {bulletin.resultatFinal?.moyenneGenerale}
        </span>
      </td>
      <td className="px-6 py-4">{bulletin.resultatFinal?.rang || '-'}</td>
      <td className="px-6 py-4 text-sm align-middle">
        {isEditingConduite ? (
          <input
            type="number"
            value={conduiteValue}
            onChange={handleConduiteChange}
            onBlur={handleConduiteBlur}
            onKeyDown={handleKeyDown}
            className="w-20 px-2 py-1.5 text-center text-sm font-medium border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
            min="0"
            max="20"
            step="0.5"
            autoFocus
            disabled={isUpdating}
          />
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${onUpdateConduite
              ? 'cursor-pointer hover:bg-primary/10 hover:scale-105 active:scale-95'
              : 'cursor-default'
              }`}
            onClick={handleConduiteClick}
            title={onUpdateConduite ? "Cliquer pour modifier" : ""}
          >
            <span className={`text-base font-semibold ${onUpdateConduite ? 'text-gray-800' : 'text-gray-600'}`}>
              {bulletin?.vieScolaire?.conduite || '-'}
            </span>
            {onUpdateConduite && (
              <Edit size={14} className="text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
          <StatusIcon size={12} />
          {statusInfo.label}
        </span>
      </td>
    </TableRow>
  );
}