import { useState } from 'react';
import { Wifi, ArrowLeft, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './styles/LoginCliente.scss';
import { AppConfig } from '../../config/app.config';

export const ForgotPassword = () => {
    const [suscriptor, setSuscriptor] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, sent, no_contact
    const [errorMsg, setErrorMsg] = useState(null);

    // Pon aquí el número de soporte de Miranda Net (con código de país, ej: 52 para México)
    const whatsappSoporte = AppConfig.whatsappNumber; 

    const handleReset = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg(null);
        try {
            await api.post('/auth/forgot-password', { suscriptor });
            setStatus('sent');
        } catch (err) {
            const data = err.response?.data;
            // Si el backend nos avisa que no tiene correo, cambiamos la pantalla
            if (data?.code === 'NO_EMAIL' || data?.message?.includes("correo")) {
                setStatus('no_contact');
            } else {
                setErrorMsg(data?.message || "Ocurrió un error. Verifica tu número de suscriptor.");
                setStatus('idle');
            }
        }
    };

    // PANTALLA 1: Éxito (Sí tenía correo)
    if (status === 'sent') {
        return (
            <div className="login-page">
                <div className="login-card success-card">
                    <CheckCircle size={48} className="success-icon" />
                    <h2>Revisa tu correo</h2>
                    <p>Enviamos instrucciones para restablecer tu clave al email asociado al suscriptor <strong>{suscriptor}</strong>.</p>
                    <Link to="/portal/login" className="btn-login" style={{marginTop: '1.5rem'}}>Volver al inicio</Link>
                </div>
            </div>
        );
    }

    // PANTALLA 2: Sin datos de contacto (No tenía correo)
    if (status === 'no_contact') {
        const mensajeWa = `Hola, soy el suscriptor ${suscriptor}. Olvidé la contraseña de mi portal y no tengo correo vinculado. ¿Me pueden ayudar a recuperarla?`;
        const linkWa = `https://wa.me/${whatsappSoporte}?text=${encodeURIComponent(mensajeWa)}`;

        return (
            <div className="login-page">
                <div className="login-card success-card" style={{padding: '3rem 2rem'}}>
                    <AlertCircle size={48} color="#ea580c" style={{margin: '0 auto 1.5rem'}} />
                    <h2>Faltan datos de contacto</h2>
                    <p style={{marginBottom: '1.5rem'}}>No encontramos un correo electrónico registrado en tu cuenta para enviarte el enlace de recuperación automática.</p>
                    
                    <a href={linkWa} target="_blank" rel="noopener noreferrer" className="btn-login" style={{background: '#25D366', color: 'white', marginBottom: '1rem'}}>
                        <MessageCircle size={18} /> Contactar por WhatsApp
                    </a>
                    
                    <button onClick={() => setStatus('idle')} className="btn-secondary" style={{width: '100%'}}>
                        Intentar con otro suscriptor
                    </button>
                </div>
            </div>
        );
    }

    // PANTALLA 3: Formulario inicial
    return (
        <div className="login-page">
            <div className="login-card">
                <Link to="/portal/login" className="back-link"><ArrowLeft size={16} /> Volver</Link>
                <div className="brand-header">
                    <h2>Recuperar acceso</h2>
                    <p>Ingresa tu número de suscriptor para ayudarte</p>
                </div>
                <form onSubmit={handleReset}>
                    {errorMsg && (
                        <div className="error-banner">
                            <AlertCircle size={18} /> {errorMsg}
                        </div>
                    )}

                    <div className="form-group">
                        <label>N.º de Suscriptor</label>
                        <input 
                            type="text" 
                            placeholder="Ej: MN-1058" 
                            value={suscriptor}
                            onChange={(e) => setSuscriptor(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-login" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Buscando...' : 'Buscar mi cuenta'}
                    </button>
                </form>
            </div>
        </div>
    );
};