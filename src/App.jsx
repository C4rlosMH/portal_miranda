import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginCliente } from './pages/portal/LoginCliente';
import { DashboardCliente } from './pages/portal/DashboardCliente';
// --- 1. Importa el nuevo componente ---
import { HistorialPagos } from './pages/portal/HistorialPagos';
import { Soporte } from './pages/portal/Soporte';
import { Perfil } from './pages/portal/Perfil';
import { ForgotPassword } from './pages/portal/ForgotPassword';
import { ResetPassword } from './pages/portal/ResetPassword';
import { Planes } from './pages/public/Planes';
import { Landing } from './pages/public/Landing';
import { Contacto } from './pages/public/Contacto';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/portal/login" element={<LoginCliente />} />
          <Route path="/olvide-password" element={<ForgotPassword />} /> 
          <Route path="/reset-password" element={<ResetPassword />} />


          {/* Area de las paginas publicas para todos */}
          <Route path="/planes" element={<Planes />} />
          <Route path="/contacto" element={<Contacto />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/portal/dashboard" element={<DashboardCliente />} />
            <Route path="/portal/perfil" element={<Perfil />} />
            {/* --- 2. Agrega la ruta del historial --- */}
            <Route path="/portal/historial" element={<HistorialPagos />} />
            <Route path="/portal/soporte" element={<Soporte />} />
             
          </Route>

        </Routes>
      </BrowserRouter>  
    </AuthProvider>
  );
}

export default App;