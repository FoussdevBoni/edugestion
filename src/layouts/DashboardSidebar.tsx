// components/DashboardSidebar.tsx
import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users, GraduationCap, BarChart3, CreditCard, FileText,
  Home, School, DollarSign, ClipboardList, Calendar,
  ChevronRight,
  ChevronLeft,
  BookOpenCheck,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import useEcoleInfos from '../hooks/ecoleInfos/useEcoleInfos';

interface MenuItem {
  label: string;
  icon: ReactNode;
  path: string;
  groupe: string;
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  schoolName?: string;
}

export default function DashboardSidebar({
  collapsed = false,
  onToggle,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { ecoleInfos } = useEcoleInfos()

  const menuItems: MenuItem[] = [
    { label: "Accueil", icon: <Home size={20} />, path: "/home", groupe: "principal" },
    { label: "Tableau de bord", icon: <LayoutDashboard size={20} />, path: "/dashboard", groupe: "principal" },
    { label: "Classes", icon: <GraduationCap size={20} />, path: "/classes", groupe: "pedagogie" },
    { label: "Matières", icon: <BookOpenCheck size={20} />, path: "/matieres", groupe: "pedagogie" },
    { label: "Élèves", icon: <Users size={20} />, path: "/eleves", groupe: "pedagogie" },
    { label: "Enseignants", icon: <GraduationCap size={20} />, path: "/enseignants", groupe: "pedagogie" },
    { label: "Emploi du temps", icon: <Calendar size={20} />, path: "/emploie-temps", groupe: "pedagogie" },
    { label: "Notes", icon: <BarChart3 size={20} />, path: "/notes", groupe: "evaluations" },
    { label: "Bulletins", icon: <FileText size={20} />, path: "/bulletins", groupe: "evaluations" },
    { label: "Inscriptions", icon: <ClipboardList size={20} />, path: "/inscriptions", groupe: "finances" },
    { label: "Paiements", icon: <DollarSign size={20} />, path: "/paiements", groupe: "finances" },
    { label: "Comptabilité", icon: <CreditCard size={20} />, path: "/comptabilite", groupe: "finances" },
    { label: "Configurations", icon: <Settings size={20} />, path: "/configuration", groupe: "systeme" },
  ];

  const groupes: Record<string, { titre: string; items: MenuItem[] }> = {
    principal: { titre: "Principal", items: [] },
    pedagogie: { titre: "Pédagogie", items: [] },
    evaluations: { titre: "Évaluations", items: [] },
    finances: { titre: "Finances", items: [] },
    systeme: { titre: "Système", items: [] },
  };

  menuItems.forEach(item => {
    if (groupes[item.groupe]) {
      groupes[item.groupe].items.push(item);
    }
  });

  const isActivePath = (path: string): boolean => {
    return location.pathname.includes(path);
  };

  const handleNavigation = (path: string) => {
    navigate(`/admin${path}`);
  };

  return (
    <aside className={`bg-white shadow-lg flex flex-col transition-all duration-300 
      ${collapsed ? 'w-20' : 'w-64'}
      border-r border-gray-100`}>
      
      {/* En-tête */}
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        {!collapsed ? (
          <Link to="/admin/dashboard" className="font-bold text-lg text-primary">
            EduGestion
          </Link>
        ) : (
          <Link to="/admin/dashboard" className="font-bold text-lg text-primary mx-auto">
            EG
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Année scolaire */}
      {!collapsed && ecoleInfos?.anneeScolaire && (
        <div className="px-4 py-2 bg-primary/5 border-b border-gray-100">
          <p className="text-xs font-medium text-primary">Année {ecoleInfos.anneeScolaire}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-4">
          {Object.values(groupes).map((groupe, idx) => groupe.items.length > 0 && (
            <li key={idx}>
              {!collapsed && (
                <div className="px-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {groupe.titre}
                </div>
              )}
              <ul className="space-y-0.5">
                {groupe.items.map((item, i) => {
                  const isActive = isActivePath(item.path);
                  return (
                    <li key={i}>
                      <div
                        onClick={() => handleNavigation(item.path)}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors
                          ${isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                          ${collapsed ? 'justify-center' : ''}
                        `}
                      >
                        <span className={isActive ? 'text-primary' : 'text-gray-500'}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="text-sm flex-1">{item.label}</span>
                        )}
                      </div>
                      {collapsed && (
                        <div className="fixed left-20 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                          {item.label}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* Pied de page */}
      <div className="p-4 border-t border-gray-100">
        {!collapsed ? (
          <div className="text-[10px] text-gray-400 text-center">
            <p>EduGestion</p>
            <p className="mt-0.5">Version 1.0.0</p>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-[10px]">
            v1.0
          </div>
        )}
      </div>
    </aside>
  )
}