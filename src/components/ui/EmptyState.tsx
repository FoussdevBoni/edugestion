
// État vide générique
export const EmptyState = ({
  icon: Icon,
  message,
  submessage
}: {
  icon: React.ComponentType<any>;
  message: string;
  submessage: string;
}) => (
  <div className="p-8 text-center">
    <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500 mb-2">{message}</p>
    <p className="text-sm text-gray-400">{submessage}</p>
  </div>
);
