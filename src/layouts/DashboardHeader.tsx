// components/DashboardHeader.tsx
import { useState } from "react";
import { 
  School, Edit, Save, X, Upload, 
 ChevronDown 
} from "lucide-react";

interface DashboardHeaderProps {
  niveauxScolaires: Array<{
    nom: string;
    cycles: string[];
  }>;
  niveauSelectionne: string;
  cycleSelectionne: string;
  onNiveauChange: (niveau: string) => void;
  onCycleChange: (cycle: string) => void;
  onResetFiltres: () => void;
}

export default function DashboardHeader({ 
  niveauxScolaires,
  niveauSelectionne,
  cycleSelectionne,
  onNiveauChange,
  onCycleChange,
  onResetFiltres
}: DashboardHeaderProps) {
  const [schoolInfo, setSchoolInfo] = useState({
    name: "Complexe Scolaire La Renaissance",
    logo: null as string | null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(schoolInfo);

  // Obtenir les cycles disponibles pour le niveau sélectionné
  const cyclesDisponibles = niveauxScolaires.find(
    n => n.nom === niveauSelectionne
  )?.cycles || [];

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(schoolInfo);
  };

  const handleSave = () => {
    setSchoolInfo(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(schoolInfo);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="px-6 py-4">
        {/* Logo et nom de l'école */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isEditing ? (
              <>
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                  {schoolInfo.logo ? (
                    <img src={schoolInfo.logo} alt="Logo" className="w-12 h-12 object-contain" />
                  ) : (
                    <School size={32} className="text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{schoolInfo.name}</h1>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                    {editForm.logo ? (
                      <img src={editForm.logo} alt="Logo" className="w-12 h-12 object-contain" />
                    ) : (
                      <School size={32} className="text-primary" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 shadow-md">
                    <Upload size={14} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>
                <div>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-2xl font-bold text-gray-800 border-b-2 border-primary/30 focus:outline-none focus:border-primary px-1 py-0 bg-transparent w-96"
                    placeholder="Nom de l'école"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit size={16} />
                Modifier l'école
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={16} />
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="mt-6 flex items-center gap-4 border-t pt-4">
          <span className="text-sm font-medium text-gray-700">Filtrer par :</span>
          
          {/* Filtre Niveau */}
          <div className="relative">
            <select
              value={niveauSelectionne}
              onChange={(e) => onNiveauChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Tous les niveaux</option>
              {niveauxScolaires.map((niveau) => (
                <option key={niveau.nom} value={niveau.nom}>
                  {niveau.nom}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filtre Cycle */}
          <div className="relative">
            <select
              value={cycleSelectionne}
              onChange={(e) => onCycleChange(e.target.value)}
              disabled={!niveauSelectionne}
              className={`appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                !niveauSelectionne ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
              }`}
            >
              <option value="">Tous les cycles</option>
              {cyclesDisponibles.map((cycle) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Bouton reset */}
          {(niveauSelectionne || cycleSelectionne) && (
            <button 
              onClick={onResetFiltres}
              className="text-sm text-red-500 hover:text-red-700 ml-2"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>
    </header>
  );
}