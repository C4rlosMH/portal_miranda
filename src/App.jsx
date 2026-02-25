import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginCliente } from './pages/portal/LoginCliente';
import { DashboardCliente } from './pages/portal/DashboardCliente';
// --- 1. Importa el nuevo componente ---
import { HistorialPagos } from './pages/portal/HistorialPagos';
import { Soporte } from './pages/portal/Soporte';
import { Perfil } from './pages/portal/Perfil';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div className="p-8">Landing Page en construccion...</div>} />
          <Route path="/portal/login" element={<LoginCliente />} />

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