import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wifi, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios'; // <-- IMPORTANTE: Importar tu API
import './styles/LoginCliente.scss';

export const LoginCliente = () => {
    const [credentials, setCredentials] = useState({ numero_suscriptor: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Hacemos la petición HTTP real a tu backend
            const response = await api.post('/auth/cliente/login', credentials);
            
            // 2. Extraemos el token real que nos envía el backend
            const tokenReal = response.data.token;
            
            // 3. Lo guardamos usando tu AuthContext
            login(tokenReal);
            
            // 4. Redirigimos
            navigate('/portal/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
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