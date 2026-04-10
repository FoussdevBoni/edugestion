import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';

import AdminNav from './navigation/admin/AdminNav';
import ScrollToTop from './components/ui/ScrollToTop';
import AuthPage from './pages/auth/AuthPage';
import InitEcolePage from './pages/init/InitEcolePage';
import { initCustomAlerts } from './helpers/alertError';
import TitleBar from './components/ui/TitleBar';

function App() {

  // Initialiser le remplacement des alerts
  initCustomAlerts();

  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <div className="flex-1 overflow-auto">
        <ScrollToTop>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/admin/*' element={<AdminNav />} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/init' element={<InitEcolePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ScrollToTop>
      </div>
    </div>
  );
}

export default App;