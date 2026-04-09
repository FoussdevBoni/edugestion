
import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';

import AdminNav from './navigation/admin/AdminNav';
import ScrollToTop from './components/ui/ScrollToTop';
import AuthPage from './pages/auth/AuthPage';
import InitEcolePage from './pages/init/InitEcolePage';
import { initCustomAlerts } from './helpers/alertError';


function App() {

// Initialiser le remplacement des alerts
initCustomAlerts();

  return (


   <ScrollToTop>
    
    <Routes>

      <Route path='/' element={<LandingPage />} />
      <Route path='/admin/*' element={<AdminNav />} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/init' element={<InitEcolePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

   </ScrollToTop>

  );
}

export default App;
