// src/pages/auth/AuthPage.tsx
import { Key, CheckCircle, XCircle, Mail, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLicence from "../../hooks/licences/useLicences";
import useEcoleInfos from "../../hooks/ecoleInfos/useEcoleInfos";

export default function AuthPage() {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid" | "checking">("idle");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { ecoleInfos } = useEcoleInfos()

  const {
    formattedMachineId,
    saveLicense,
    licenseStatus
  } = useLicence();

  // Rediriger si déjà validé
  useEffect(() => {
    if (licenseStatus?.valid) {
      if (!ecoleInfos) {
        navigate("/init");

      } else {
        navigate("/admin/home");

      }
    }
  }, [licenseStatus, ecoleInfos, navigate]);

  const copyToClipboard = () => {
    if (formattedMachineId) {
      navigator.clipboard.writeText(formattedMachineId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkLicense = async () => {
    if (!licenseKey) return;
    setStatus("checking");

    const result = await saveLicense(licenseKey);

    if (result.valid) {
      setStatus("valid");
      if (!ecoleInfos) {
        navigate("/init");

      } else {
        navigate("/admin/dashboard");

      }
    } else {
      setStatus("invalid");
      console.log(result)
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Key size={48} className="text-indigo-600 mb-2" />
          <h2 className="text-2xl font-bold text-center">Activation de licence</h2>
          <p className="text-gray-500 text-center mt-1 text-sm">
            Entrez votre clé pour activer l'application
          </p>
        </div>

        {/* Affichage de l'ID machine */}
        {formattedMachineId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Identifiant de cette machine :
            </p>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
              <code className="text-sm font-mono text-primary">
                {formattedMachineId}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copier l'identifiant"
              >
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-gray-500" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Envoyez cet identifiant à votre fournisseur pour obtenir votre clé de licence.
            </p>
          </div>
        )}

        <input
          type="text"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
          disabled={status === "checking"}
        />

        <button
          onClick={checkLicense}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          disabled={status === "checking" || !licenseKey}
        >
          {status === "checking" ? "Vérification..." : "Activer"}
        </button>

        {status === "valid" && (
          <div className="mt-4 flex items-center text-green-600 font-semibold gap-2">
            <CheckCircle size={18} /> Licence activée avec succès
          </div>
        )}

        {status === "invalid" && (
          <div className="mt-4 flex flex-col items-center text-red-600 font-semibold gap-2">
            <div className="flex items-center gap-2">
              <XCircle size={18} /> Licence invalide
            </div>
            <span className="text-sm text-gray-500 mt-1 text-center">
              Vérifiez votre clé ou contactez le support.
            </span>
            <button className="mt-2 flex items-center gap-2 text-primary font-medium hover:underline">
              <Mail size={16} /> support@example.com
            </button>
          </div>
        )}
      </div>
    </div>
  );
}