// src/components/auth/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLicence from '../../hooks/licences/useLicences';

export default function ProtectedRoute({ children }: {children: ReactNode}) {
  const navigate = useNavigate();
  const {  checking, checkStoredLicense } = useLicence();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyLicense = async () => {
      // Si déjà validé, on ne refait pas
      if (isValid === true) return;

      const result = await checkStoredLicense();
      
      if (!result?.valid) {
        navigate('/', { replace: true });
      } else {
        setIsValid(true);
      }
    };

    verifyLicense();
  }, [checkStoredLicense, navigate, isValid]);

  // Si la vérification est en cours, on affiche les enfants mais avec un overlay
  if (checking || isValid === null) {
    return (
      <>
        {children}
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification de la licence...</p>
          </div>
        </div>
      </>
    );
  }

  // Licence valide → afficher le contenu normalement
  return isValid ? <>{children}</> : null;
}