import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users, GraduationCap, BarChart3, CreditCard, FileText, Key,
  Home, School, DollarSign, ClipboardList, Calendar,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Types simplifiés
interface MenuItem {
  label: string;
  icon: ReactNode;
  path: string;
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  schoolName?: string;
}

export default function DashboardSidebar({
  collapsed = false,
  onToggle,
  schoolName = "Complexe Scolaire"
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Définition des menus pour une école
  const menuItems: MenuItem[] = [
    { label: "Tableau de bord", icon: <Home size={20} />, path: "/dashboard" },
    { label: "Configurer mon école", icon: <School size={20} />, path: "/configuration" },
    { label: "Élèves", icon: <Users size={20} />, path: "/eleves" },
    { label: "Enseignants", icon: <GraduationCap size={20} />, path: "/enseignants" },
    { label: "Emploi du temps", icon: <Calendar size={20} />, path: "/emploie-temps" },
    { label: "Notes", icon: <BarChart3 size={20} />, path: "/notes" },
    { label: "Paiements", icon: <DollarSign size={20} />, path: "/paiements" },
    { label: "Inscriptions", icon: <ClipboardList size={20} />, path: "/inscriptions" },
    { label: "Comptabilité", icon: <CreditCard size={20} />, path: "/comptabilite" },
    { label: "Bulletins", icon: <FileText size={20} />, path: "/bulletins" },
    { label: "Licences", icon: <Key size={20} />, path: "/licences" },
  ];

  // Vérifier si un chemin est actif
  const isActivePath = (path: string): boolean => {
    return location.pathname.includes(path);
  };

  // Gérer la navigation
  const handleNavigation = (path: string) => {
   
    navigate(`/admin${path}`);
  };

  return (
    <aside className={`bg-white shadow-lg flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
      }`}>
      {/* En-tête avec logo et nom de l'école */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed ? (
          <div className="flex flex-col">
            <Link to="/dashboard" className="font-bold text-xl text-primary">
              EduGestion
            </Link>
            <span className="text-xs text-gray-500">{schoolName}</span>
          </div>
        ) : (
          <Link to="/dashboard" className="font-bold text-xl text-primary mx-auto">
            E
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Année scolaire en cours */}
      {!collapsed && (
        <div className="px-4 py-2 bg-primary/5 border-b">
          <p className="text-xs font-medium text-primary">Année 2024-2025</p>
        </div>
      )}

      {/* Navigation principale */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = isActivePath(item.path);

            return (
              <li key={index}>
                <div
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    flex items-center gap-3 p-2 rounded cursor-pointer transition-colors
                    ${isActive ? 'bg-primary text-white' : 'hover:bg-primary/10 text-gray-700'}
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className={isActive ? 'text-white' : 'text-gray-600'}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="flex-1 text-sm">{item.label}</span>
                  )}

                  {/* Tooltip pour le mode réduit */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pied de page avec version et infos école */}
      <div className="p-4 border-t">
        {!collapsed ? (
          <>
            <div className="text-xs text-gray-500 text-center">
              <p>Complexe Scolaire</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 text-xs">
            v1.0
          </div>
        )}
      </div>
    </aside>
  )
}