import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { ArrowRight } from 'lucide-react';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';
import { PublicNav } from '../../components/public/PublicNav';

import './styles/Planes.scss';

export const Planes = () => {
    const [planesDisponibles, setPlanesDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Instanciar navigate

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
        // Redirige a la página de contacto. 
        // Pasamos el nombre del plan en el estado por si quieres autocompletar un formulario allí.
        navigate('/contacto', { state: { planSeleccionado: planNombre } });
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