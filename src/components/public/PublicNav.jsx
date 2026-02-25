import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Wifi, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './styles/PublicNav.scss';

export const PublicNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    return (
        <nav className="public-nav">
            <div className="nav-left">
                <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
                    <Wifi className="brand-icon" /> Miranda Net
                </Link>
            </div>

            {/* Agregamos los enlaces explícitos aquí */}
            <div className="nav-links">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inicio</Link>
                <Link to="/planes" className={location.pathname === '/planes' ? 'active' : ''}>Planes</Link>
                <Link to="/contacto" className={location.pathname === '/contacto' ? 'active' : ''}>Contacto</Link>
            </div>
            
            <div className="nav-right">
                {isAuthenticated ? (
                    <button onClick={() => navigate('/portal/dashboard')} className="btn-nav outline">
                        <ArrowLeft size={16} /> Volver al Portal
                    </button>
                ) : (
                    <button onClick={() => navigate('/portal/login')} className="btn-nav solid">
                        Soy cliente
                    </button>
                )}
            </div>
        </nav>
    );
};