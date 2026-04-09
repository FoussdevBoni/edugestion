import { ReactNode, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ConfigurationLayoutProps {
    children: ReactNode;
}

export default function ComptabiliteLayout({ children }: ConfigurationLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const basePath = "/admin/comptabilite";

    const tabItems = [
        {
            label: "Acceuil",
            path: "/accueil"
        },
        {
            label: "Les achats",
            path: "/achats"
        },
         {
            label: "Les charges",
            path: "/charges"
        },
        {
            label: "Le matériel",
            path: "/materiel"
        },
         {
            label: "Mouvements de stock",
            path: "/mouvements"
        },
        {
            label: "Inventaires",
            path: "/inventaires"
        },
        {
            label: "Transactions",
            path: "/transactions"
        },
        
    ];

    // Fonction pour vérifier si un tab est actif
    const isActive = (path: string) => {
        const currentPath = location.pathname;

        if (path === "") {
            // Pour "Infos générales", on vérifie si on est exactement sur /admin/configuration
            return currentPath === basePath;
        } else {
            // Pour les autres, on vérifie si le chemin inclut le path
            return currentPath.includes(path);
        }
    };

    // Scroll vers la gauche
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    // Scroll vers la droite
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    // Scroll automatiquement vers le tab actif au chargement
    useEffect(() => {
        const activeIndex = tabItems.findIndex(item => isActive(item.path));
        if (activeIndex !== -1 && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const activeTab = container.children[activeIndex] as HTMLElement;

            if (activeTab) {
                const containerWidth = container.offsetWidth;
                const tabLeft = activeTab.offsetLeft;
                const tabWidth = activeTab.offsetWidth;

                // Centrer le tab actif si possible
                const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
                container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            }
        }
    }, [location.pathname]);

    return (
        <div className="">
            {/* Barre de navigation avec tabs scrollables */}
            <div className="bg-white border-b border-gray-200 sticky top-0  z-10">
                <div className="relative flex items-center">
                    {/* Bouton scroll gauche */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 z-10 bg-white h-full px-2 shadow-right hover:text-primary transition-colors hidden md:flex items-center"
                        style={{ boxShadow: '4px 0 8px -4px rgba(0,0,0,0.1)' }}
                    >
                        <ChevronLeft size={20} className="text-gray-500" />
                    </button>

                    {/* Conteneur scrollable des tabs */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-x-auto scrollbar-hide px-8 md:px-10"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex space-x-1 min-w-max py-2">
                            {tabItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(`${basePath}${item.path}`)}
                                    className={`
                                        px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                                        ${isActive(item.path)
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bouton scroll droit */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 z-10 bg-white h-full px-2 shadow-left hover:text-primary transition-colors hidden md:flex items-center"
                        style={{ boxShadow: '-4px 0 8px -4px rgba(0,0,0,0.1)' }}
                    >
                        <ChevronRight size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Contenu de la page */}
            <div className="px-6 py-10">
                {children}
            </div>

            {/* Style pour cacher la scrollbar tout en gardant la fonctionnalité */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}