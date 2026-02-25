import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

import './styles/TopNav.scss';

export const TopNav = ({ userName }) => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation(); 

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="top-nav">
            <div className="logo-container">
                {/* LOGO */}
                <div className="logo" onClick={() => navigate('/portal/dashboard')}>
                    Miranda<span>Net</span>
                </div>
                
                {/* ENLACES DE NAVEGACION */}
                <ul className="nav-links hidden-mobile">
                    <li>
                        <div className={`nav-item ${isActive('/portal/dashboard')}`} onClick={() => navigate('/portal/dashboard')}>
                            Inicio
                        </div>
                    </li>
                    <li>
                        <div className={`nav-item ${isActive('/portal/historial')}`} onClick={() => navigate('/portal/historial')}>
                            Mis pagos
                        </div>
                    </li>
                    <li>
                        <div className={`nav-item ${isActive('/portal/soporte')}`} onClick={() => navigate('/portal/soporte')}>
                            Tickets
                        </div>
                    </li>
                </ul>
            </div>

            <div className="nav-right">
                {/* CAMBIAR TEMA */}
                <button onClick={toggleTheme} className="icon-btn hidden-mobile" title="Cambiar tema">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                
                {/* PERFIL (USER CHIP) */}
                <div 
                    className={`user-chip ${isActive('/portal/perfil')}`} 
                    onClick={() => navigate('/portal/perfil')}
                    title="Ajustes de cuenta"
                >
                    <div className="avatar">
                        {userName ? userName.substring(0, 2).toUpperCase() : <User size={16} />}
                    </div>
                    <span className="user-name hidden-mobile">{userName || 'Mi Perfil'}</span>
                </div>

                {/* CERRAR SESION */}
                <button onClick={logout} className="icon-btn logout-btn" title="Cerrar sesión">
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};