import { Key, CheckCircle, XCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LicenseScreen() {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid" | "checking">("idle");
  const navigate = useNavigate()
  const checkLicense = async () => {
    if (!licenseKey) return;
    setStatus("checking");

    // Simule vérification (ici tu remplaces par appel backend Rust / API)
    await new Promise((r) => setTimeout(r, 1000));

    if (licenseKey === "SCO-LAR-2026") {
      setStatus("valid");
      navigate("/admin/dashboard")
    } else {
      setStatus("invalid");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Key size={48} className="text-indigo-600 mb-2" />
          <h2 className="text-2xl font-bold text-center">Activation de licence</h2>
          <p className="text-gray-500 text-center mt-1 text-sm">
            Entrez votre clé pour activer ScolarERP
          </p>
        </div>

        <input
          type="text"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
        />

        <button
          onClick={checkLicense}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary transition"
          disabled={status === "checking"}
        >
          {status === "checking" ? "Vérification..." : "Vérifier"}
        </button>

        {status === "valid" && (
          <div className="mt-4 flex items-center text-green-600 font-semibold gap-2">
            <CheckCircle /> Licence valide
          </div>
        )}

        {status === "invalid" && (
          <div className="mt-4 flex flex-col items-center text-red-600 font-semibold gap-2">
            <div className="flex items-center gap-2">
              <XCircle /> Licence invalide
            </div>
            <span className="text-sm text-gray-500 mt-1">
              Contactez le support si vous pensez que c'est une erreur.
            </span>
            <button className="mt-2 flex items-center gap-2 text-primary font-medium hover:underline">
              <Mail size={16} /> Contacter support
            </button>
          </div>
        )}
      </div>
    </div>
  );
}