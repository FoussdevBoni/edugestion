import { CheckCircle2, XCircle } from "lucide-react";

// Composant Modal réutilisable
const ConfirmationModal: React.FC<{
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'success' | 'danger';
}> = ({ title, message, confirmText, onConfirm, onCancel, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'danger':
        return <XCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {getIcon()}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>

          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 ${getButtonColor()} text-white rounded-lg font-medium transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal