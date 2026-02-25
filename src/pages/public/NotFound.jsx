import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './styles/NotFound.scss';

export const NotFound = () => {
    // Usamos el contexto para saber si el usuario tiene un token activo
    const { isAuthenticated } = useAuth();

    return (
        <div className="not-found-page">
            <h1 className="nf-title">404</h1>
            <h2 className="nf-subtitle">Página no encontrada</h2>
            <p className="nf-text">
                La URL a la que intentas acceder no existe en nuestro portal.
            </p>
            
            {isAuthenticated ? (
                <Link to="/portal/dashboard" className="btn-nf">
                    Regresar al Dashboard
                </Link>
            ) : (
                <Link to="/" className="btn-nf">
                    Regresar al Inicio
                </Link>
            )}
        </div>
    );
};