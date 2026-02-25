import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, ArrowLeft, Plus, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';
import { TopNav } from '../../components/portal/TopNav';
import { ModalPago } from '../../components/portal/ModalPago';

import './styles/DashboardCliente.scss'; 
import './styles/HistorialPagos.scss';

export const HistorialPagos = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    // Estados combinados
    const [pagos, setPagos] = useState([]);
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPaying, setIsPaying] = useState(false);

    const [showPagoModal, setShowPagoModal] = useState(false);
    
    // Estado del filtro UI
    const [filtroActivo, setFiltroActivo] = useState('Todos');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(AppConfig.locale, {
            style: 'currency',
            currency: AppConfig.currencyCode
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(AppConfig.locale, options);
    };

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [resPagos, resPerfil] = await Promise.all([
                    api.get('/portal/historial'),
                    api.get('/portal/dashboard')
                ]);
                setPagos(resPagos.data);
                setPerfil(resPerfil.data);
            } catch (err) {
                setError("No pudimos cargar tu información.");
                if (err.response?.status === 401) logout();
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, [logout]);

    const handlePago = async (datosPago) => {
        try {
            setError(null);
            setSuccessMsg(null);
            setIsPaying(true);

            // Ahora enviamos datosPago (que contiene tipo_pago y opcionalmente monto)
            const response = await api.post('/portal/pagar', datosPago);

            if (response.data.url_pago) {
                window.location.href = response.data.url_pago;
            }
        } catch (err) {
            setError(err.response?.data?.message || "Ocurrió un error al intentar generar el link de pago.");
            setShowPagoModal(false); // Cerramos el modal si falla
        } finally {
            setIsPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-blue-600 font-semibold text-lg">Cargando historial...</div>
            </div>
        );
    }

    // --- CÁLCULOS DINÁMICOS PARA LA UI ---
    
    // 1. Saldo
    const saldoPendiente = perfil ? (Number(perfil.saldo_actual) + Number(perfil.deuda_historica) + Number(perfil.saldo_aplazado)) : 0;
    const tieneDeuda = saldoPendiente > 0;
    
    // 2. Día de corte (Leemos de la BD. Si tu backend manda "dia_vencimiento" o "dia_pago", cámbialo aquí)
    const diaCorte = perfil?.dia_corte ? String(perfil.dia_corte).padStart(2, '0') : '--';
    
    // 3. Mes dinámico (Calcula automáticamente cuál es el mes que sigue)
    const fechaActual = new Date();
    const mesSiguiente = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(fechaActual.setMonth(fechaActual.getMonth() + 1)));

    // 4. Filtro visual de pagos (Solo UI)
    const pagosFiltrados = pagos; 

    return (
        <div className="dashboard-v2-wrapper historial-v2-wrapper">
            <TopNav userName={perfil?.nombre_completo} />

            <main className="page-content">
                
                <div className="page-header">
                    <div className="page-header-left">
                        <button className="back-btn" onClick={() => navigate('/portal/dashboard')}>
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="page-title">Mis pagos</h1>
                    </div>
                    <button 
                        className="btn-primary" 
                        onClick={() => setShowPagoModal(true)}
                        disabled={isPaying}
                    >
                        {isPaying ? 'Generando...' : 'Generar link de pago'}
                    </button>
                </div>

                {error && (
                    <div className="alert-message error" style={{marginBottom: '1.5rem'}}>
                        <AlertCircle size={20} /> <p>{error}</p>
                    </div>
                )}

                <div className="summary-strip">
                    <div className="sstrip-card">
                        <div className="sstrip-label">Próximo corte</div>
                        <div className="sstrip-value accent">
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <Calendar size={24} /> Día {diaCorte}
                            </span>
                        </div>
                        <div className="sstrip-sub" style={{textTransform: 'capitalize'}}>
                            Mensualidad de {mesSiguiente}
                        </div>
                    </div>
                    <div className="sstrip-card">
                        <div className="sstrip-label">Saldo pendiente</div>
                        <div className={`sstrip-value ${tieneDeuda ? 'red' : 'green'}`}>
                            {formatCurrency(saldoPendiente)}
                        </div>
                        <div className="sstrip-sub">
                            {tieneDeuda ? 'Tienes saldo por cubrir' : 'Todo al día ✓'}
                        </div>
                    </div>
                </div>

                <div className="filters-row">
                    <button 
                        className={`filter-btn ${filtroActivo === 'Todos' ? 'active' : ''}`}
                        onClick={() => setFiltroActivo('Todos')}
                    >
                        Todos
                    </button>
                    <button 
                        className={`filter-btn ${filtroActivo === 'Pagados' ? 'active' : ''}`}
                        onClick={() => setFiltroActivo('Pagados')}
                    >
                        Pagados
                    </button>
                </div>

                <div className="payments-card">
                    {pagosFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <Receipt size={48} className="empty-icon" />
                            <h3 className="empty-title">Aún no hay pagos registrados</h3>
                            <p className="empty-sub">Tus recibos aparecerán aquí cuando se procesen.</p>
                        </div>
                    ) : (
                        <>
                            <div className="payments-header">
                                <div className="ph-col">Descripción</div>
                                <div className="ph-col">Fecha</div>
                                <div className="ph-col right">Monto</div>
                            </div>

                            {pagosFiltrados.map((pago) => (
                                <div key={pago.id} className="payment-row">
                                    <div className="pr-info">
                                        <div className="pr-icon"><Receipt size={18} /></div>
                                        <div>
                                            <div className="pr-name">{pago.concepto || 'Mensualidad'}</div>
                                            <div className="pr-date">{pago.metodo_pago || 'Mercado Pago'}</div>
                                        </div>
                                    </div>
                                    <div className="pr-period" style={{fontSize: '0.875rem', fontWeight: 600}}>
                                        {formatDate(pago.fecha)}
                                    </div>
                                    <div className="pr-amount-status">
                                        <div className="pr-amount">{formatCurrency(pago.monto)}</div>
                                        <div className="badge paid">
                                            <span className="badge-dot"></span> Pagado
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

            </main>

            <ModalPago 
                isOpen={showPagoModal}
                onClose={() => setShowPagoModal(false)}
                perfil={perfil}
                onConfirm={handlePago}
                isProcessing={isPaying}
            />
        </div>
    );
};