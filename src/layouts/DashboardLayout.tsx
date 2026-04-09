// layouts/DashboardLayout.tsx
import { ReactNode, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { useEcoleNiveau } from "../hooks/filters/useEcoleNiveau";
import { EcoleNiveauProvider } from "../contexts/EcoleNiveauProvider";
import useNiveauxScolaires from "../hooks/niveauxScolaires/useNiveauxScolaires";

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardContent({ children }: { children: ReactNode }) {
  const { niveauSelectionne, cycleSelectionne, setNiveau,
     setCycle, resetFiltres } = useEcoleNiveau();
  const {niveauxScolaires} = useNiveauxScolaires()
  const [collapsed , setCollapsed] = useState(false)

  const onToggle = ()=>{
    setCollapsed(!collapsed)
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <DashboardSidebar onToggle={onToggle} collapsed = {collapsed} />
      <main className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader 
          niveauxScolaires={niveauxScolaires}
          niveauSelectionne={niveauSelectionne}
          cycleSelectionne={cycleSelectionne}
          onNiveauChange={setNiveau}
          onCycleChange={setCycle}
          onResetFiltres={resetFiltres}
        />
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <EcoleNiveauProvider>
      <DashboardContent>
        {children}
      </DashboardContent>
    </EcoleNiveauProvider>
  );
}