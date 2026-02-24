import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // Si no esta autenticado, lo mandamos al login y evitamos que guarde el historial
    if (!isAuthenticated) {
        return <Navigate to="/portal/login" replace />;
    }

    // Si esta autenticado, renderizamos la ruta hija (el dashboard)
    return <Outlet />;
};