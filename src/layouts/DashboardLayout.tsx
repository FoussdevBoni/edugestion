// layouts/DashboardLayout.tsx
import { ReactNode, useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { useEcoleNiveau } from "../hooks/filters/useEcoleNiveau";
import { EcoleNiveauProvider } from "../contexts/EcoleNiveauProvider";
import useNiveauxScolaires from "../hooks/niveauxScolaires/useNiveauxScolaires";
import useCycles from "../hooks/cycles/useCycles";
import { RefreshProvider, useRefresh } from "../contexts/RefreshContext";
import useEcoleImages from "../hooks/ecoleInfos/useEcoleImages";
import useEcoleInfos from "../hooks/ecoleInfos/useEcoleInfos";

interface DashboardLayoutProps {
  children: ReactNode
  childrenClassName?: string
}

function DashboardContent({ children , childrenClassName }: 
  { children: ReactNode ,   childrenClassName?: string
 }) {
  const { niveauSelectionne, cycleSelectionne, setNiveau,
    setCycle, resetFiltres } = useEcoleNiveau();
  const { niveauxScolaires, loadNiveaux: loadNiveauxScolaires } = useNiveauxScolaires()
  const { loadCycles } = useCycles()
  const [collapsed, setCollapsed] = useState(false)
  const { refreshImages, logoUrl } = useEcoleImages()
  const { getEcoleInfos, ecoleInfos } = useEcoleInfos()
  const onToggle = () => {
    setCollapsed(!collapsed)
  }

  const { registerRefresh } = useRefresh();

  useEffect(() => {
    registerRefresh(() => {
      loadNiveauxScolaires();
      loadCycles();
      refreshImages();
      getEcoleInfos()

    });
  }, [loadNiveauxScolaires, loadCycles, registerRefresh, getEcoleInfos, refreshImages]);


  return (
    <div className="h-screen flex bg-gray-100">
      <DashboardSidebar onToggle={onToggle} collapsed={collapsed} />
      <main className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader
          logoUrl={logoUrl}
          ecoleInfos={ecoleInfos}
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

export default function DashboardLayout({ children, childrenClassName }: DashboardLayoutProps) {
  return (
    <EcoleNiveauProvider>
      <RefreshProvider>
        <DashboardContent childrenClassName={childrenClassName}>
          {children}
        </DashboardContent>
      </RefreshProvider>
    </EcoleNiveauProvider>
  );
}