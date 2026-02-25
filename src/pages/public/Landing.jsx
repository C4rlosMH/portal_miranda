import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Zap, ArrowRight } from 'lucide-react';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';
import './styles/Landing.scss';

export const Landing = () => {
    const [scrolled, setScrolled] = useState(false);
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Efecto para el scroll de la navegación
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Carga dinámica de planes desde el Backend
    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                const res = await api.get('/planes/publicos');
                setPlanes(res.data);
            } catch (error) {
                console.error("Error al obtener planes dinámicos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlanes();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(AppConfig.locale, {
            style: 'currency',
            currency: AppConfig.currencyCode
        }).format(amount || 0);
    };

    const linkWhatsapp = (plan = '') => {
        const msg = plan 
            ? `Hola, me interesa contratar el plan ${plan}.` 
            : 'Hola, me gustaría recibir información sobre el servicio de internet.';
        return `https://wa.me/${AppConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    };

    return (
        <div className="landing-page">
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <Link to="/" className="brand">
                    <div className="brand-dot"></div>
                    Miranda<span>Net</span>
                </Link>
                <div className="nav-links">
                    <Link to="/planes">Planes</Link>
                    <Link to="/contacto">Contacto</Link>
                </div>
                <Link to="/portal/login" className="btn-portal">Mi Portal →</Link>
            </nav>

            <header className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <div className="dot"></div>
                        Red Operativa · Fibra Óptica
                    </div>
                    <h1>Internet que<br/><em>nunca</em> te<br/>falla.</h1>
                    <p>Conexión estable con velocidades reales y soporte técnico humano. El servicio de {AppConfig.appName} está diseñado para que tu hogar nunca se detenga.</p>
                    <Link to="/planes" className="btn-portal" style={{padding:'1rem 2rem', fontSize:'1rem'}}>
                        Ver planes disponibles
                    </Link>
                </div>

                <div className="hero-visual">
                    <div className="visual-circle"></div>
                    <div className="floating-card status" style={{top:'10%', left:0}}>
                        <div className="brand-dot"></div> Servicio Activo
                    </div>
                    <div className="floating-card" style={{top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'#111', color:'white', textAlign:'center', width:'180px'}}>
                        <span style={{fontFamily:'Fraunces', fontSize:'3rem', display:'block'}}>200</span>
                        <span style={{fontSize:'0.8rem', opacity:0.5}}>Mbps Simétricos</span>
                    </div>
                    <div className="floating-card" style={{bottom:'10%', right:0}}>
                        <Zap size={18} color="#1a45c4" /> Latencia 12ms
                    </div>
                </div>
            </header>

            <section className="planes-section-dark">
                <div className="section-header" style={{textAlign:'center', marginBottom:'4rem'}}>
                    <h2 style={{fontFamily:'Fraunces', fontSize:'2.8rem'}}>Planes a tu medida</h2>
                    <p>Fibra óptica directa hasta tu domicilio.</p>
                </div>

                <div className="planes-grid">
                    {loading ? (
                        <p style={{textAlign:'center', width:'100%', opacity:0.5}}>Actualizando ofertas...</p>
                    ) : (
                        planes.map((plan, index) => (
                            <div key={plan.id} className={`plan-card-dark ${index === 1 ? 'featured' : ''}`}>
                                <span className="plan-badge">{index === 1 ? '⭐ Recomendado' : 'Plan'}</span>
                                <div className="plan-price">
                                    {formatCurrency(plan.precio_mensual)} <span style={{fontSize:'1rem', opacity:0.4}}>/mes</span>
                                </div>
                                <div className="plan-speed">{plan.velocidad_mb} Mbps Simétricos</div>
                                <ul style={{listStyle:'none', padding:0, marginBottom:'2rem', fontSize:'0.9rem', opacity:0.7}}>
                                    <li>Misma velocidad de subida</li>
                                    <li>Instalación sin cargo</li>
                                    <li>Soporte técnico incluido</li>
                                </ul>
                                <button 
                                    className="btn-plan" 
                                    style={{
                                        width:'100%', padding:'0.8rem', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.2)', 
                                        background: index === 1 ? 'white' : 'transparent', 
                                        color: index === 1 ? '#1a45c4' : 'white', fontWeight:600, cursor:'pointer'
                                    }}
                                    onClick={() => window.open(linkWhatsapp(plan.nombre))}
                                >
                                    Contratar ahora
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};