import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, User, Lock, LogIn, AlertCircle } from 'lucide-react';
import api from '../../api/axios.js';
import { AppConfig } from '../../config/app.config.js';
import { useTheme } from '../../hooks/useTheme.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './styles/LoginCliente.scss';

export const LoginCliente = () => {
    const [numeroSuscriptor, setNumeroSuscriptor] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    
    // Extraemos la funcion login de nuestro contexto de seguridad
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/cliente/login', {
                numero_suscriptor: numeroSuscriptor,
                password: password
            });

            // Usamos la funcion del contexto en lugar de localStorage directo
            // Esto actualiza el estado global de la aplicacion y guarda el token
            login(response.data.token);
            
            navigate('/portal/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper relative">
            
            {/* Boton flotante para cambiar el tema con iconos */}
            <button 
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label="Alternar tema"
            >
                {theme === 'light' ? (
                    <><Moon size={18} /><span>Oscuro</span></>
                ) : (
                    <><Sun size={18} /><span>Claro</span></>
                )}
            </button>

            <div className="login-card">
                
                <div className="login-header">
                    <div className="logo-circle">
                        <span>{AppConfig.appName.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <h1>{AppConfig.appName}</h1>
                    <p>Portal de Suscriptores</p>
                </div>

                <div className="login-body">
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={18} className="error-icon" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Numero de Suscriptor</label>
                            <div className="input-with-icon">
                                <User size={20} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Ej. MN-1001"
                                    value={numeroSuscriptor}
                                    onChange={(e) => setNumeroSuscriptor(e.target.value.toUpperCase())}
                                    className="uppercase-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Contrasena</label>
                            <div className="input-with-icon">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="Ingresa tu contrasena"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-submit"
                        >
                            {loading ? (
                                'Verificando...'
                            ) : (
                                <>
                                    <span>Iniciar Sesion</span>
                                    <LogIn size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>¿Necesitas ayuda? Contacta a soporte:</p>
                        <p className="support-phone">{AppConfig.supportPhone}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};