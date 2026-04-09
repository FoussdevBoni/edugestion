// src/components/admin/rows/EvaluationRow.tsx
import { MoreVertical, FileText } from "lucide-react";
import { Evaluation } from "../../../utils/types/data";

interface EvaluationRowProps {
  evaluation: Evaluation;
  onAction: (evaluation: Evaluation) => void;
}

export default function EvaluationRow({ evaluation, onAction }: EvaluationRowProps) {
 

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText size={16} className="text-primary" />
          </div>
          <span className="font-medium text-gray-800">{evaluation.nom}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {evaluation.periode}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {evaluation.abreviation}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <span>{evaluation.type}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onAction(evaluation)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}