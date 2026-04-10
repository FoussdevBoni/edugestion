// components/TitleBar.tsx
import { Minus, Square, X } from 'lucide-react';

export default function TitleBar() {
  const handleMinimize = () => {
    (window as any).electron.minimizeWindow();
  };

  const handleMaximize = () => {
    (window as any).electron.maximizeWindow();
  };

  const handleClose = () => {
    (window as any).electron.closeWindow();
  };

  return (
    <div className="h-10 bg-primary flex items-center justify-between px-4 drag-region select-none">
      <div className="text-white text-sm font-medium">
        EduGestion
      </div>
      <div className="flex items-center gap-1 no-drag">
        <button
          onClick={handleMinimize}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleMaximize}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/80 hover:text-white"
        >
          <Square size={14} />
        </button>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-md hover:bg-red-500 transition-colors text-white/80 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}