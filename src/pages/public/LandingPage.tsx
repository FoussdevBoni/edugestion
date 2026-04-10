import { Users, GraduationCap, BarChart3, CreditCard, FileText, Key, Mail, School, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-6 py-28 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            EduGestion
          </h1>
          <p className="text-xl text-white/80 mt-4 max-w-2xl mx-auto">
            La solution complète pour gérer votre établissement scolaire
          </p>

          <p className="mt-6 text-white/70 max-w-2xl mx-auto">
            Gérez élèves, enseignants, matières, bulletins et comptabilité dans une interface simple et sécurisée.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate("/auth")}
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
            >
              Commencer <ChevronRight size={18} />
            </button>
            <a 
              href="#features"  
              className="border border-white/30 px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition duration-300"
            >
              Voir les fonctionnalités
            </a>
          </div>
        </div>

        <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gray-50 rounded-t-[50px]" />
      </section>

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800">Fonctionnalités clés</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour gérer votre établissement efficacement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={<Users size={28} />} title="Gestion des élèves" description="Inscriptions, dossiers et suivi académique complet." />
          <FeatureCard icon={<GraduationCap size={28} />} title="Gestion enseignants" description="Suivi des enseignants, matières et emplois du temps." />
          <FeatureCard icon={<BarChart3 size={28} />} title="Matières & coefficients" description="Organisation claire par classe et matière." />
          <FeatureCard icon={<CreditCard size={28} />} title="Comptabilité" description="Reçus, journal de caisse et suivi des paiements." />
          <FeatureCard icon={<FileText size={28} />} title="Bulletins automatiques" description="Génération PDF avec logo et informations de l'école." />
          <FeatureCard icon={<Key size={28} />} title="Licences" description="Activation sécurisée du logiciel pour votre établissement." />
          <FeatureCard icon={<Users size={28} />} title="Cartes d'identité scolaire" description="Création et impression simple des cartes élèves." />
          <FeatureCard icon={<School size={28} />} title="Multi-établissements" description="Gérez plusieurs écoles depuis une seule interface." />
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <span className="text-primary text-sm font-medium">Pourquoi nous choisir</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Une solution complète pour votre école</h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Application desktop légère et rapide
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Fonctionne même sans internet
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Interface intuitive et personnalisable
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Export PDF / Excel et rapports automatiques
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-2xl shadow-inner border border-primary/10">
            <div className="h-64 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg flex items-center justify-center text-white text-xl font-semibold">
              Aperçu du Dashboard
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary/90 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold">Prêt à moderniser votre établissement ?</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Contactez-nous pour une démo ou pour installer EduGestion dans votre école.
          </p>
          <button className="mt-8 bg-white text-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition duration-300 flex items-center gap-2 justify-center mx-auto">
            <Mail size={20} /> Contacter le support
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-8 mb-6">
            <span className="text-sm hover:text-white transition cursor-pointer">À propos</span>
            <span className="text-sm hover:text-white transition cursor-pointer">Contact</span>
            <span className="text-sm hover:text-white transition cursor-pointer">Mentions légales</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} EduGestion — Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}