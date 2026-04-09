import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { HashRouter } from 'react-router-dom'; 
import { EcoleNiveauProvider } from './contexts/EcoleNiveauProvider';

const container = document.getElementById('root');
const root = createRoot(container!);


// 1. Définition du composant de chargement (Pur CSS pour être instantané)
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'sans-serif'
  }}>
    <div className="spinner"></div>
    <p style={{ marginTop: '20px', color: '#4b5563', fontWeight: 500 }}>
      Initialisation du système scolaire...
    </p>
    <style>{`
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #e5e7eb;
        border-top: 5px solid #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <HashRouter>
          <EcoleNiveauProvider>
            <App />
          </EcoleNiveauProvider>
      </HashRouter>
    </React.StrictMode>
  );
};

// --- LOGIQUE DE DÉMARRAGE ---

if ((window as any).electron) {
  renderApp();
} else {
  // Afficher le loader immédiatement en attendant le pont
  root.render(<LoadingScreen />);

  let attempts = 0;
  const maxAttempts = 50;

  const checkBridge = setInterval(() => {
    attempts++;
    
    if ((window as any).electron) {
      clearInterval(checkBridge);
      renderApp();
    } 

    if (attempts >= maxAttempts) {
      clearInterval(checkBridge);
      console.error("❌ Pont introuvable.");
      renderApp(); 
    }
  }, 100);
}