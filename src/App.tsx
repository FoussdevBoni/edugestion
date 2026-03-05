
import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';

import AdminNav from './navigation/admin/AdminNav';
import LicenseScreen from './pages/auth/LicenceScreen';


function App() {

  return (



    <Routes>

      <Route path='/' element={<LandingPage />} />
      <Route path='/admin/*' element={<AdminNav />} />
      <Route path='/login' element={<LicenseScreen />} />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>


  );
}

export default App;
