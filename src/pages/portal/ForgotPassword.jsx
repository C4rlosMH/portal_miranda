import { useState } from 'react';
import { Wifi, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export const ForgotPassword = () => {
    const [suscriptor, setSuscriptor] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, sent, error

    const handleReset = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            // Este endpoint debe buscar el correo del suscriptor y enviar el mail
            await api.post('/auth/forgot-password', { suscriptor });
            setStatus('sent');
        } catch (err) {
            setStatus('error');
        }
    };

    if (status === 'sent') {
        return (
            <div className="login-page">
                <div className="login-card success-card">
                    <CheckCircle size={48} className="success-icon" />
                    <h2>Revisá tu correo</h2>
                    <p>Enviamos instrucciones para restablecer tu clave al email asociado al suscriptor <strong>{suscriptor}</strong>.</p>
                    <Link to="/login" className="btn-login" style={{marginTop: '1.5rem'}}>Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <Link to="/login" className="back-link"><ArrowLeft size={16} /> Volver</Link>
                <div className="brand-header">
                    <h2>Recuperar acceso</h2>
                    <p>Ingresá tu número de suscriptor para ayudarte</p>
                </div>
                <form onSubmit={handleReset}>
                    <div className="form-group">
                        <label>N.º de Suscriptor</label>
                        <input 
                            type="text" 
                            placeholder="MN-0000" 
                            value={suscriptor}
                            onChange={(e) => setSuscriptor(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-login" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Buscando...' : 'Enviar instrucciones'}
                    </button>
                </form>
            </div>
        </div>
    );
};