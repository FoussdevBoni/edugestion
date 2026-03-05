import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { EcoleNiveauProvider } from './contexts/EcoleNiveauProvider';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <BrowserRouter>
       <EcoleNiveauProvider>
         <App />
       </EcoleNiveauProvider>
  </BrowserRouter>
  </React.StrictMode>
);