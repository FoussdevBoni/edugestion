import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- Composant pour chaque bouton de raccourci ---
const MenuShortcut = ({ icon, label, path, onNavigate }: { icon: string; label: string; path: string; onNavigate: (path: string) => void }) => (
  <div 
    onClick={() => onNavigate(path)}
    className="flex flex-col items-center justify-center p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-2xl cursor-pointer group bg-white/80 backdrop-blur-sm border border-white/50 hover:border-primary/30"
  >
    {/* Conteneur de l'image */}
    <div className="w-20 h-20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
      <img 
        src={icon} 
        alt={label} 
        className="max-w-full max-h-full object-contain"
      />
    </div>
    {/* Texte */}
    <span className="text-[13px] font-bold text-slate-700 text-center leading-tight uppercase tracking-wide group-hover:text-primary transition-colors">
      {label}
    </span>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(`/admin${path}`);
  };

  const modules = [
    { label: "Tableau de bord", icon: "https://cdn-icons-png.flaticon.com/512/167/167707.png", path: "/dashboard" },
    { label: "Classes", icon: "https://cdn-icons-png.flaticon.com/512/4699/4699192.png", path: "/classes" },
    { label: "Matières", icon: "https://cdn-icons-png.flaticon.com/512/3429/3429153.png", path: "/matieres" },
    { label: "Élèves", icon: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png", path: "/eleves" },
    { label: "Inscriptions", icon: "https://cdn-icons-png.flaticon.com/512/3456/3456388.png", path: "/inscriptions" },
    { label: "Enseignants", icon: "https://cdn-icons-png.flaticon.com/512/1995/1995539.png", path: "/enseignants" },
    { label: "Emploi du temps", icon: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png", path: "/emploi-temps" },
    { label: "Notes", icon: "https://cdn-icons-png.flaticon.com/512/583/583327.png", path: "/notes" },
    { label: "Bulletins", icon: "https://cdn-icons-png.flaticon.com/512/1048/1048927.png", path: "/bulletins" },
    { label: "Paiements", icon: "https://cdn-icons-png.flaticon.com/512/2489/2489756.png", path: "/paiements" },
    { label: "Comptabilité", icon: "https://cdn-icons-png.flaticon.com/512/2636/2636335.png", path: "/comptabilite" },
    { label: "Paramètres Académiques", icon: "https://cdn-icons-png.flaticon.com/512/3524/3524659.png", path: "/configuration" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50
     to-indigo-100 font-sans overflow-x-hidden py-5">
      {/* Header avec dégradé */}
      <header className="w-full bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-sm border-b border-white/20 py-6 mb-10 shadow-lg">
        <h1 className="text-center text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
          APPLICATION DE GESTION SCOLAIRE
        </h1>
      </header>

      {/* Zone de contenu principale */}
      <main className="max-w-5xl mx-auto px-4">
        {/* Titre de section avec décoration */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-16 h-px bg-primary/30"></div>
            </div>
            <h2 className="relative px-6 text-xl font-bold text-slate-700 uppercase tracking-widest bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-100 inline-block">
              Portail Scolaire
            </h2>
            <div className="absolute inset-0 flex items-center justify-end">
              <div className="w-16 h-px bg-primary/30"></div>
            </div>
          </div>
          <div className="w-20 h-1 bg-primary/50 rounded-full mt-3"></div>
        </div>

        {/* Grille de 4 colonnes avec animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
          {modules.map((module, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MenuShortcut 
                icon={module.icon} 
                label={module.label} 
                path={module.path}
                onNavigate={handleNavigation}
              />
            </div>
          ))}
        </div>
      </main>



      {/* Styles d'animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default HomePage;