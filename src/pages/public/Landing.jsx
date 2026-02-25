import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    Zap, Wrench, Signal, CreditCard, Clock, 
    Gamepad2, Laptop, Tv, Smartphone,
    PhoneCall, ClipboardList, Rocket, Router, MonitorSmartphone
} from 'lucide-react';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';
import './styles/Landing.scss';



export const Landing = () => {
    const [scrolled, setScrolled] = useState(false);
    const [planes, setPlanes] = useState([]);
    const [stats, setStats] = useState({ clientesActivos: 0 });
    const [loading, setLoading] = useState(true);
    const [phoneInput, setPhoneInput] = useState('');
    const [toastMsg, setToastMsg] = useState('');
    const [logoClicks, setLogoClicks] = useState(0);
    const observerRef = useRef(null);

    // Scroll Navbar
    useEffect(() => {

        console.log(
            "%c¡Hola! %c\n¿Buscando errores en el código? Si eres así de curioso, seguro apreciarás un proveedor de internet que no te miente. Contrata Miranda Net.", 
            "color: #1a45c4; font-size: 24px; font-weight: bold;", 
            "color: #7a7568; font-size: 14px;"
        );

        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer para animaciones Reveal
    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    const children = e.target.querySelectorAll('.feat-cell, .hiw-step, .plan-d');
                    children.forEach((child, i) => {
                        child.style.transitionDelay = (i * 0.07) + 's';
                        child.style.opacity = '0';
                        child.style.transform = 'translateY(16px)';
                        child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, i * 70);
                    });
                }
            });
        }, { threshold: 0.12 });

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [planes]);

    // Carga de Planes y Estadísticas
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtenemos los planes (que ahora traen plan.cantidad_clientes desde el backend)
                const resPlanes = await api.get('/planes/publicos');
                setPlanes(resPlanes.data);

                // Obtenemos los clientes activos reales
                try {
                    const resStats = await api.get('/planes/stats-publicos'); // <-- Actualizado a /planes/
                    if(resStats.data) setStats(resStats.data);
                } catch (e) {
                    console.error("No se pudieron cargar las estadísticas públicas", e);
                }

            } catch (error) {
                console.error("Error al obtener datos dinámicos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    // Lógica para enviar el número de consulta por WhatsApp
    const handleCtaSubmit = () => {
        if (!phoneInput.trim()) return;
        const msg = `Hola, quiero consultar si hay cobertura en mi dirección. Mi número de contacto es: ${phoneInput}`;
        window.open(`https://wa.me/${AppConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
        setPhoneInput('');
    };

    // Determinar dinámicamente el plan más popular
    // Asume que tu backend envía una propiedad como "cantidad_clientes" en cada plan
    const maxClientes = planes.length > 0 ? Math.max(...planes.map(p => p.cantidad_clientes || 0)) : 0;

    const handleSecretClick = (e) => {
        // Evitamos que el link te lleve a la parte de arriba si solo estás haciendo el easter egg
        if (logoClicks < 4) e.preventDefault(); 
        
        setLogoClicks(prev => prev + 1);
        
        if (logoClicks + 1 === 5) {
            setToastMsg('Modo Dios activado: Velocidad ilimitada (mentira, no vendemos humo).');
            setTimeout(() => setToastMsg(''), 4500);
            setLogoClicks(0); // Reiniciamos el contador
        }
    };

    return (
        <div className="landing-page">
            {/* NAV */}
            <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="main-nav">
                <Link to="/" className="nav-logo" onClick={handleSecretClick}>
                    <div className="nav-dot"></div>
                    Miranda<span>Net</span>
                </Link>
                <ul className="nav-links">  
                    <li><a href="#features">Beneficios</a></li>
                    <li><a href="#planes">Planes</a></li>
                    <li><a href="#como-funciona">Cómo funciona</a></li>
                    <li><Link to="/portal/login" className="nav-cta">Mi Portal</Link></li>
                </ul>
            </nav>

            {/* HERO */}
            <div className="hero">
                <div className="hero-left">
                    <div className="hero-eyebrow">
                        <span className="hero-eyebrow-dot"></span>
                        Fibra Óptica · Radioenlace · Disponible ahora · Ramonal, Tab.
                    </div>
                    <h1 className="hero-h1">
                        Internet en el que<br />
                        puedes<br />
                        <span className="underline-word">confiar.</span>
                    </h1>
                    <p className="hero-sub">
                        Conexión estable y soporte técnico humano. El servicio de {AppConfig.appName} está diseñado para mantener tu hogar conectado sin promesas falsas.
                    </p>
                    <div className="hero-actions">
                        <a href="#planes" className="btn-hero-primary">Ver planes disponibles</a>
                        <a href="#como-funciona" className="btn-hero-secondary">¿Cómo funciona?</a>
                    </div>
                    <div className="hero-trust">
                        <div className="htrust-item">
                            <div className="htrust-num">{stats.clientesActivos > 0 ? `+${stats.clientesActivos}` : 'Activo'}</div>
                            <div className="htrust-label">{stats.clientesActivos > 0 ? 'Clientes en la red' : 'Red operando'}</div>
                        </div>
                        <div className="htrust-sep"></div>
                        <div className="htrust-item">
                            <div className="htrust-num">Soporte</div>
                            <div className="htrust-label">Local y directo</div>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="hero-visual">
                        <div className="hv-circle"></div>

                        {/* Elemento central: Representación del equipo */}
                        <div className="hv-center-icon">
                            <Router size={56} color="var(--accent)" strokeWidth={1.5} />
                        </div>

                        {/* Tarjetas de promesas reales */}
                        <div className="hv-card hv-card-status" style={{ top: '15%', left: '0' }}>
                            <div className="status-green-dot"></div>
                            <span>Red operativa en Ramonal</span>
                        </div>

                        <div className="hv-card hv-card-ping" style={{ bottom: '15%', left: '5%' }}>
                            <div className="card-label">Soporte</div>
                            <div className="card-val" style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>Atención local</div>
                        </div>

                        <div className="hv-card hv-card-up" style={{ top: '25%', right: '0' }}>
                            <div className="card-label">Estabilidad</div>
                            <div className="card-val" style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>Monitoreo 24/7</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOGOS STRIP */}
            <div className="logos-strip">
                <span className="logos-label">Conecta tus dispositivos</span>
                <div className="logos-sep"></div>
                <div className="logo-chip"><Tv size={16}/> Smart TV</div>
                <div className="logo-chip"><Gamepad2 size={16}/> Consolas</div>
                <div className="logo-chip"><Laptop size={16}/> Trabajo y escuela</div>
                <div className="logo-chip"><Smartphone size={16}/> Múltiples celulares</div>
            </div>

            {/* FEATURES */}
            <section className="features-section" id="features">
                <div className="features-header reveal">
                    <div>
                        <div className="section-eyebrow">Beneficios</div>
                        <h2 className="section-title">Por qué elegir<br /><em>Miranda Net</em></h2>
                    </div>
                    <p className="features-sub">Te hablamos con la verdad. Entregamos un servicio estable y nos hacemos responsables cuando necesitas ayuda.</p>
                </div>

                <div className="features-grid reveal">
                    <div className="feat-cell">
                        <Zap className="feat-cell-icon" />
                        <div className="feat-cell-title">Conexión estable</div>
                        <div className="feat-cell-desc">Nuestra red está optimizada para que puedas navegar, estudiar y trabajar sin interrupciones constantes.</div>
                    </div>
                    <div className="feat-cell">
                        <Wrench className="feat-cell-icon" />
                        <div className="feat-cell-title">Soporte técnico real</div>
                        <div className="feat-cell-desc">Técnicos locales que responden y conocen la red. Sin robots telefónicos ni esperas eternas.</div>
                    </div>
                    <div className="feat-cell">
                        <Signal className="feat-cell-icon" />
                        <div className="feat-cell-title">Radioenlace y Fibra</div>
                        <div className="feat-cell-desc">Llegamos a tu domicilio con tecnología eficiente para asegurar que recibas el servicio contratado.</div>
                    </div>
                    <div className="feat-cell">
                        <CreditCard className="feat-cell-icon" />
                        <div className="feat-cell-title">Costos transparentes</div>
                        <div className="feat-cell-desc">Solo cubres el costo del equipo (módem) y tu primera mensualidad. Sin cuotas de instalación engañosas.</div>
                    </div>
                    <div className="feat-cell">
                        <Clock className="feat-cell-icon" />
                        <div className="feat-cell-title">Servicio continuo</div>
                        <div className="feat-cell-desc">Monitoreamos nuestra red 24/7 para prevenir caídas y mantener tu conexión activa.</div>
                    </div>
                    <div className="feat-cell">
                        <MonitorSmartphone className="feat-cell-icon" />
                        <div className="feat-cell-title">Portal de Autogestión</div>
                        <div className="feat-cell-desc">Paga en línea, revisa tu historial, solicita prórrogas y abre tickets de soporte directamente desde tu celular o PC.</div>
                    </div>
                </div>
            </section>

            {/* PLANS */}
            <div className="plans-section" id="planes">
                <div className="plans-inner">
                    <div className="plans-header reveal">
                        <div>
                            <div className="plans-eyebrow">Planes</div>
                            <h2 className="plans-title">El precio justo para<br /><em>cada hogar</em></h2>
                        </div>
                        <p className="plans-note">Todos los planes requieren la compra del equipo receptor inicial.</p>
                    </div>

                    <div className="plans-grid-dark reveal">
                        {loading ? (
                            <p style={{ color: 'white', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Cargando planes disponibles...</p>
                        ) : (
                            planes.map((plan) => {
                                // Comprueba si este plan es el que tiene más clientes
                                const isPopular = plan.cantidad_clientes && plan.cantidad_clientes === maxClientes && maxClientes > 0;
                                
                                return (
                                    <div key={plan.id} className={`plan-d ${isPopular ? 'pop' : ''}`}>
                                        <div className="pd-badge">{isPopular ? 'Más elegido' : 'Plan'}</div>
                                        <div className="pd-name">{plan.nombre}</div>
                                        <div className="pd-price">{formatCurrency(plan.precio_mensual)}</div>
                                        <div className="pd-period">por mes · sin plazos forzosos</div>
                                        <div className="pd-speed"><strong>{plan.velocidad_mb} Mbps</strong> de velocidad</div>
                                        <ul className="pd-features">
                                            <li>Soporte técnico local</li>
                                            <li>Monitoreo de red</li>
                                            <li>Acceso al portal de clientes</li>
                                        </ul>
                                        <button onClick={() => window.open(linkWhatsapp(plan.nombre))} className="pd-btn">
                                            Contratar
                                        </button>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <section className="hiw-section" id="como-funciona">
                <div className="reveal">
                    <div className="section-eyebrow">Proceso</div>
                    <h2 className="section-title">De cero a conectado<br /><em>paso a paso</em></h2>
                </div>

                <div className="hiw-grid reveal">
                    <div className="hiw-step">
                        <div className="hiw-num">01</div>
                        <PhoneCall className="hiw-icon" size={28} />
                        <div className="hiw-title">Nos contactas</div>
                        <div className="hiw-desc">Envías tu número o dirección para confirmar viabilidad y cobertura en tu zona.</div>
                    </div>
                    <div className="hiw-step">
                        <div className="hiw-num">02</div>
                        <ClipboardList className="hiw-icon" size={28} />
                        <div className="hiw-title">Eliges tu plan</div>
                        <div className="hiw-desc">Te explicamos las opciones claramente y cotizamos el equipo necesario para tu domicilio.</div>
                    </div>
                    <div className="hiw-step">
                        <div className="hiw-num">03</div>
                        <Wrench className="hiw-icon" size={28} />
                        <div className="hiw-title">Coordinamos instalación</div>
                        <div className="hiw-desc">Acudimos a tu domicilio para colocar el receptor y dejar la red funcionando.</div>
                    </div>
                    <div className="hiw-step">
                        <div className="hiw-num">04</div>
                        <Rocket className="hiw-icon" size={28} />
                        <div className="hiw-title">Listo para navegar</div>
                        <div className="hiw-desc">Te entregamos acceso a tu portal de cliente y tu internet queda activo.</div>
                    </div>
                </div>
            </section>

            <section className="social-section" id="trabajos">
                <div className="reveal">
                    <div className="section-eyebrow">Trabajos Recientes</div>
                    <h2 className="section-title">Nuestra red en<br /><em>acción</em></h2>
                    <p className="social-sub">
                        Conoce nuestras ultimas instalaciones, mantenimiento de antenas y actualizaciones de la red directamente desde nuestra pagina oficial.
                    </p>
                </div>

                <div className="social-frame-container reveal">
                    {/* Plugin oficial de Facebook vinculado a app.config.js */}
                    <iframe 
                        src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(AppConfig.socialLinks.facebook)}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                        width="500" 
                        height="600" 
                        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }} 
                        scrolling="no" 
                        frameBorder="0" 
                        allowFullScreen={true} 
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        title="Trabajos recientes de Miranda Net"
                    ></iframe>
                </div>
            </section>

            {/* CTA */}
            <div className="cta-section" id="contacto">
                <div className="cta-inner reveal">
                    <div className="cta-eyebrow">Consulta sin compromiso</div>
                    <h2 className="cta-title">¿Tu dirección tiene<br /><em>cobertura?</em></h2>
                    <p className="cta-sub">Escribe tu número y abriremos un chat de WhatsApp para confirmarte la viabilidad hoy mismo.</p>
                    <div className="cta-form">
                        <input 
                            className="cta-input" 
                            type="tel" 
                            placeholder="Tu número de celular" 
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCtaSubmit()}
                        />
                        <button className="cta-btn" onClick={handleCtaSubmit}>Consultar</button>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="footer-landing">
                <Link to="/" className="footer-logo">Miranda<span>Net</span></Link>
                <ul className="footer-links">
                    <li><a href="#planes">Planes</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                    <li><Link to="/portal/login">Portal de clientes</Link></li>
                </ul>
                <div className="footer-copy">© {new Date().getFullYear()} Miranda Net · Todos los derechos reservados</div>
            </footer>

            <div className={`toast-notification ${toastMsg ? 'show' : ''}`}>
                {toastMsg}
            </div>
        </div>
    );
};