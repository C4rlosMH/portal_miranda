import { useState } from 'react';
import { PhoneCall, MessageCircle, Mail, MapPin, ArrowRight } from 'lucide-react';
import { AppConfig } from '../../config/app.config';
import { PublicNav } from '../../components/public/PublicNav';

import './styles/Contacto.scss';

export const Contacto = () => {
    const [enviado, setEnviado] = useState(false);

    const linkWhatsapp = `https://wa.me/${AppConfig.whatsappNumber}?text=${encodeURIComponent('Hola, me comunico desde la pagina web de Miranda Net.')}`;
    const linkLlamada = `tel:${AppConfig.supportPhone.replace(/-/g, '')}`;
    const linkEmail = `mailto:${AppConfig.supportEmail}`;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);
        setTimeout(() => setEnviado(false), 5000);
        e.target.reset();
    };

    return (
        <div className="contacto-public-page">
            <PublicNav />

            <main className="contacto-main">
                <div className="header-section">
                    <h1>Estamos aqui para ayudarte</h1>
                    <p>Ya sea que necesites contratar un nuevo plan, requieras soporte tecnico o tengas dudas sobre tu facturacion, elige el canal que prefieras.</p>
                </div>

                <div className="contacto-grid">
                    
                    <div className="contact-methods">
                        <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="method-card">
                            <div className="icon-box whatsapp"><MessageCircle size={24} /></div>
                            <div className="info">
                                <h3>WhatsApp</h3>
                                <p>Respuesta rapida para ventas y soporte agil.</p>
                                <span className="action-text">Enviar mensaje <ArrowRight size={14} /></span>
                            </div>
                        </a>

                        <a href={linkLlamada} className="method-card">
                            <div className="icon-box phone"><PhoneCall size={24} /></div>
                            <div className="info">
                                <h3>Llamada telefonica</h3>
                                <p>{AppConfig.supportPhone}</p>
                                <span className="action-text">Llamar ahora <ArrowRight size={14} /></span>
                            </div>
                        </a>

                        <a href={linkEmail} className="method-card">
                            <div className="icon-box email"><Mail size={24} /></div>
                            <div className="info">
                                <h3>Correo electronico</h3>
                                <p>{AppConfig.supportEmail}</p>
                                <span className="action-text">Escribir un correo <ArrowRight size={14} /></span>
                            </div>
                        </a>

                        <div className="method-card" style={{cursor: 'default'}}>
                            <div className="icon-box location"><MapPin size={24} /></div>
                            <div className="info">
                                <h3>Nuestra oficina</h3>
                                <p>Av. Principal #123, Centro. Lunes a Viernes de 9am a 6pm.</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-wrapper">
                        <h2>Dejanos un mensaje</h2>
                        {enviado ? (
                            <div style={{background: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem'}}>
                                Mensaje enviado con exito. Te contactaremos pronto.
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label>Nombre completo</label>
                                    <input type="text" placeholder="Ej: Juan Perez" required />
                                </div>
                                <div className="form-group">
                                    <label>Telefono o Celular</label>
                                    <input type="tel" placeholder="Para devolverte la llamada" required />
                                </div>
                                <div className="form-group">
                                    <label>¿En que podemos ayudarte?</label>
                                    <textarea placeholder="Escribe tu consulta aqui..." required></textarea>
                                </div>
                                <button type="submit" className="btn-submit">Enviar mensaje</button>
                            </form>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};