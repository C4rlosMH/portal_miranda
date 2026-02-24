import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginCliente } from './pages/portal/LoginCliente';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Publicas */}
          <Route path="/" element={<div className="p-8">Landing Page en construccion...</div>} />
          <Route path="/portal/login" element={<LoginCliente />} />

          {/* Rutas Protegidas (Solo accesibles con Token) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/portal/dashboard" element={<div className="p-8 text-center mt-20 text-2xl">¡Dashboard Protegido! Solo ves esto si tienes sesion.</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;