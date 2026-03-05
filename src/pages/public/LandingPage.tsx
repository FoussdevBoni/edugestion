import { Users, GraduationCap, BarChart3, CreditCard, FileText, Key, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-6 py-28 text-center">
          <h1 className="text-5xl font-bold leading-tight max-w-4xl mx-auto">
            EduGestion
            <span className="block text-primary/30 mt-3">
              La solution desktop pour gérer votre établissement
            </span>
          </h1>

          <p className="mt-6 text-lg text-primary/50 max-w-2xl mx-auto">
            Gérez élèves, enseignants, matières, bulletins et comptabilité dans une interface simple et sécurisée.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button 
              onClick={() => navigate("/admin/dashboard")}
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Demander une démo
            </button>
            <a 
              href="#features"  
              className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-primary transition"
            >
              Voir les fonctionnalités
            </a>
          </div>
        </div>

        <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gray-50 rounded-t-[50%]" />
      </section>

      {/* FEATURES */}
      <section id="features" className="container mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">
          Fonctionnalités clés
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard icon={<Users size={32} />} title="Gestion des élèves" description="Inscriptions, dossiers et suivi académique complet." />
          <FeatureCard icon={<GraduationCap size={32} />} title="Gestion enseignants" description="Suivi des enseignants, matières et emplois du temps." />
          <FeatureCard icon={<BarChart3 size={32} />} title="Matières & coefficients" description="Organisation claire par classe et matière." />
          <FeatureCard icon={<CreditCard size={32} />} title="Comptabilité" description="Reçus, journal de caisse et suivi des paiements." />
          <FeatureCard icon={<FileText size={32} />} title="Bulletins automatiques" description="Génération PDF avec logo et informations de l’école." />
          <FeatureCard icon={<Key size={32} />} title="Licences" description="Activation sécurisée du logiciel pour votre établissement." />
          <FeatureCard icon={<Users size={32} />} title="Cartes d’identité scolaire" description="Création et impression simple des cartes élèves." />
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="bg-white py-24 border-t">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Pourquoi ScolarERP ?</h3>
            <ul className="space-y-4 text-gray-600">
              <li>✔ Application desktop légère et rapide</li>
              <li>✔ Fonctionne même sans internet</li>
              <li>✔ Interface intuitive et personnalisable</li>
              <li>✔ Export PDF / Excel et rapports automatiques</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-10 rounded-2xl shadow-inner">
            <div className="h-64 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg flex items-center justify-center text-white text-xl font-semibold">
              Aperçu du Dashboard
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <h2 className="text-3xl font-bold">Prêt à moderniser votre établissement ?</h2>
        <p className="mt-4 text-primary/30">Contactez-nous pour une démo ou pour installer ScolarERP dans votre école.</p>
        <button className="mt-8 bg-white text-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition flex items-center gap-2 justify-center mx-auto">
          <Mail size={20} /> Contacter le support
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm">
        © {new Date().getFullYear()} ScolarERP — Tous droits réservés
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition border flex flex-col items-start gap-3">
      <div className="text-primary">{icon}</div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}