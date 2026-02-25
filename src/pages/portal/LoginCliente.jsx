import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wifi, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios'; 
import './styles/LoginCliente.scss';

export const LoginCliente = () => {
    const [credentials, setCredentials] = useState({ numero_suscriptor: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [secretUnlocked, setSecretUnlocked] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    // Easter Egg: Escribir "cerohumo"
    useEffect(() => {
        const secretCode = ['m', 'i', 'r', 'a', 'n', 'd', 'a'];
        let secretIndex = 0;

        const handleKeyDown = (e) => {
            // Convertimos la tecla a minúscula para que funcione incluso con Bloq Mayus activado
            const key = e.key.toLowerCase();
            
            if (key === secretCode[secretIndex]) {
                secretIndex++;
                if (secretIndex === secretCode.length) {
                    setSecretUnlocked(true);
                    // Ocultamos el mensaje después de 5 segundos
                    setTimeout(() => setSecretUnlocked(false), 5000);
                    secretIndex = 0;
                }
            } else {
                secretIndex = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/cliente/login', credentials);
            const tokenReal = response.data.token;
            login(tokenReal);
            navigate('/portal/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Botón para regresar al Landing Page */}
            <Link to="/" className="back-link-fixed">
                <ArrowLeft size={18} /> Volver al inicio
            </Link>

            {/* Notificación del Easter Egg */}
            <div className={`toast-notification ${secretUnlocked ? 'show' : ''}`}>
                [SISTEMA] Protocolo activado: Conexion 100% fibra, 0% humo.
            </div>

            <div className="login-card">
                <div className="brand-header">
                    <div className="brand-icon"><Wifi size={28} /></div>
                    <h1>Miranda Net</h1>
                    <p>Portal de Clientes</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-banner">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>N.º de Suscriptor</label>
                        <input 
                            type="text" 
                            placeholder="Ej: MN-1058"
                            value={credentials.numero_suscriptor}
                            onChange={(e) => setCredentials({...credentials, numero_suscriptor: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="label-row">
                            <label>Contraseña</label>
                            <Link to="/olvide-password" title="Recuperar acceso">¿La olvidaste?</Link>
                        </div>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? <Loader2 className="spinner" /> : (
                            <>Entrar al portal <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};