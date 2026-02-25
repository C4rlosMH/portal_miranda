import { useState, useEffect } from 'react';
import { Wifi, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './styles/LoginCliente.scss';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({ nueva: '', confirmar: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!token) {
            setErrorMsg("Enlace inválido. Asegúrate de usar el enlace completo del correo.");
            setStatus('error');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.nueva !== passwords.confirmar) {
            setErrorMsg("Las contraseñas no coinciden.");
            return;
        }

        if (passwords.nueva.length < 8) {
            setErrorMsg("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setStatus('loading');
        setErrorMsg(null);

        try {
            await api.post('/auth/reset-password', { 
                token, 
                nuevaPassword: passwords.nueva 
            });
            setStatus('success');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Ocurrió un error al restablecer la contraseña.");
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="login-page">
                <div className="login-card success-card">
                    <CheckCircle size={48} className="success-icon" />
                    <h2>¡Todo listo!</h2>
                    <p>Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión en tu portal.</p>
                    <Link to="/portal/login" className="btn-login" style={{marginTop: '1.5rem'}}>
                        Ir al inicio de sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="brand-header">
                    <div className="brand-icon"><Wifi size={28} /></div>
                    <h2>Crear nueva contraseña</h2>
                    <p>Ingresa tu nueva clave de acceso</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {errorMsg && (
                        <div className="error-banner">
                            <AlertCircle size={18} /> {errorMsg}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Nueva contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Mínimo 8 caracteres"
                            value={passwords.nueva}
                            onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
                            required
                            disabled={!token || status === 'loading'}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Repite la contraseña"
                            value={passwords.confirmar}
                            onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
                            required
                            disabled={!token || status === 'loading'}
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={!token || status === 'loading'}>
                        {status === 'loading' ? <Loader2 className="spinner" /> : (
                            <>Guardar y continuar <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};