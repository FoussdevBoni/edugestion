// src/components/auth/EcoleRequired.tsx
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEcoleInfos from '../../hooks/ecoleInfos/useEcoleInfos';

interface EcoleRequiredProps {
  children: ReactNode;
}

export default function EcoleRequired({ children }: EcoleRequiredProps) {
  const navigate = useNavigate();
  const { ecoleInfos, loading } = useEcoleInfos();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!ecoleInfos?.nom) {
        // Pas d'infos école → redirection vers /init
        navigate('/init', { replace: true });
      } else {
        setChecking(false);
      }
    }
  }, [ecoleInfos, loading, navigate]);

  // Pendant le chargement ou la vérification
  if (loading || checking) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de la configuration...</p>
        </div>
      </div>
    );
  }

  // École configurée → afficher le contenu
  return <>{children}</>;
}