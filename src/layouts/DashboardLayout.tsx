// layouts/DashboardLayout.tsx
import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { useEcoleNiveau } from "../hooks/filters/useEcoleNiveau";
import { EcoleNiveauProvider } from "../contexts/EcoleNiveauProvider";

interface DashboardLayoutProps {
  children: ReactNode
}

// Composant interne qui a accès au contexte
function DashboardContent({ children }: { children: ReactNode }) {
  const { niveauSelectionne, cycleSelectionne, niveauxScolaires, setNiveau,
     setCycle, resetFiltres } = useEcoleNiveau();

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Header avec les filtres */}
        <DashboardHeader 
          niveauxScolaires={niveauxScolaires}
          niveauSelectionne={niveauSelectionne}
          cycleSelectionne={cycleSelectionne}
          onNiveauChange={setNiveau}
          onCycleChange={setCycle}
          onResetFiltres={resetFiltres}
        />

        {/* Page content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Layout principal qui wrap avec le provider
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <EcoleNiveauProvider>
      <DashboardContent>
        {children}
      </DashboardContent>
    </EcoleNiveauProvider>
  );
}