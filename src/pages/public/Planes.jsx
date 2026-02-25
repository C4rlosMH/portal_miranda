import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';
import { PublicNav } from '../../components/public/PublicNav';

import './styles/Planes.scss';

export const Planes = () => {
    const [planesDisponibles, setPlanesDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                const res = await api.get('/planes/publicos');
                setPlanesDisponibles(res.data);
            } catch (error) {
                console.error("Error al cargar los planes:", error);
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

    const contactarVentas = (planNombre) => {
        const mensaje = `Hola, me interesa contratar o cambiarme al plan ${planNombre}.`;
        window.open(`https://wa.me/${AppConfig.whatsappNumber}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    return (
        <div className="planes-public-page">
            <PublicNav />

            <main className="planes-main">
                <h1 className="main-title">Conectividad sin limites</h1>
                <p className="main-subtitle">Elige el plan que mejor se adapte a tu hogar.</p>

                {loading ? (
                    <div style={{ color: 'var(--muted-miranda)', fontWeight: 'bold' }}>Cargando planes disponibles...</div>
                ) : (
                    <div className="planes-grid">
                        {planesDisponibles.map(plan => (
                            <div key={plan.id} className="plan-card">
                                <h3 className="plan-name">{plan.nombre}</h3>
                                <div className="plan-price">
                                    {formatCurrency(plan.precio_mensual)} <span>/mes</span>
                                </div>
                                <p className="plan-desc">
                                    <strong>{plan.velocidad_mb} Megas</strong> de velocidad de bajada y subida con soporte tecnico garantizado.
                                </p>
                                
                                <button onClick={() => contactarVentas(plan.nombre)} className="btn-cta">
                                    Contratar ahora <ArrowRight size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};