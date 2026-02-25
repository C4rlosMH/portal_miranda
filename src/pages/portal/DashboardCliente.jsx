import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, FileText, Zap, Activity, Headphones, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';
import { TopNav } from '../../components/portal/TopNav';
import { ModalProrroga } from '../../components/portal/ModalProrroga';
import { ModalPago } from '../../components/portal/ModalPago';

import './styles/DashboardCliente.scss';

export const DashboardCliente = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPaying, setIsPaying] = useState(false);

    const [showProrrogaModal, setShowProrrogaModal] = useState(false);
    const [isAplazando, setIsAplazando] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);

    const [showPagoModal, setShowPagoModal] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(AppConfig.locale, {
            style: 'currency',
            currency: AppConfig.currencyCode
        }).format(amount || 0);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/portal/dashboard');
                setPerfil(response.data);
            } catch (err) {
                setError("No pudimos cargar tu información. Por favor, recarga la página.");
                if (err.response?.status === 401) logout();
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
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

    const handleAplazarPago = async () => {
        try {
            setIsAplazando(true);
            setError(null);
            
            const response = await api.post('/portal/aplazar');
            
            setPerfil(prev => ({
                ...prev,
                estado: 'ACTIVO',
                saldo_actual: response.data.nuevo_saldo_actual,
                saldo_aplazado: response.data.nuevo_saldo_aplazado
            }));
            
            setShowProrrogaModal(false);
            setSuccessMsg(response.data.message || "Tu servicio ha sido reactivado exitosamente.");
            setTimeout(() => setSuccessMsg(null), 5000);
            
        } catch (err) {
            setError(err.response?.data?.message || "No se pudo procesar la solicitud de prórroga.");
            setShowProrrogaModal(false);
        } finally {
            setIsAplazando(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-blue-600 font-semibold text-lg">Cargando tu información...</div>
            </div>
        );
    }

    const isSuspendido = perfil.estado === 'SUSPENDIDO';
    const saldoTotal = (Number(perfil.saldo_actual) + Number(perfil.deuda_historica) + Number(perfil.saldo_aplazado));
    const mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date());

    return (
        <div className="dashboard-v2-wrapper">
            <TopNav userName={perfil?.nombre_completo} />

            <div className="main-content">
                <div className="left-col">
                    
                    {error && (
                        <div className="alert-message error">
                            <AlertCircle size={20} /> <p>{error}</p>
                        </div>
                    )}
                    
                    {successMsg && (
                        <div className="alert-message success">
                            <CheckCircle size={20} /> <p>{successMsg}</p>
                        </div>
                    )}

                    <div className="greeting">
                        <h1>Buen día, {perfil.nombre_completo.split(' ')[0]}</h1>
                        <p>Acá tienes un resumen de tu servicio.</p>
                    </div>

                    <div className={`status-card ${isSuspendido ? 'status-suspended' : 'status-active'}`}>
                        <div className="status-left">
                            <div className="status-icon-wrap">
                                {isSuspendido ? <WifiOff size={24} /> : <Wifi size={24} />}
                            </div>
                            <div className="status-text">
                                <strong>{isSuspendido ? 'Servicio suspendido' : 'Conexión activa'}</strong>
                                <span>{isSuspendido ? 'Presentas un adeudo en tu cuenta.' : 'Tu servicio funciona con normalidad.'}</span>
                            </div>
                        </div>
                        <div className="status-badge">
                            <div className="dot"></div>
                            {isSuspendido ? 'Desconectado' : 'En línea'}
                        </div>
                    </div>

                    <div className="quick-grid">
                        <div className="qcard" onClick={() => navigate('/portal/red')}>
                            <div className="qcard-icon"><FileText size={20} /></div>
                            <div className="qcard-label">Mi plan</div>
                            <div className="qcard-value">{perfil.plan?.nombre || 'Básico'}</div>
                            <div className="qcard-sub">{formatCurrency(perfil.plan?.precio_mensual)} / mes</div>
                            <div className="qcard-link">Ver plan &rarr;</div>
                        </div>
                        <div className="qcard" onClick={() => navigate('/portal/red')}>
                            <div className="qcard-icon"><Zap size={20} /></div>
                            <div className="qcard-label">Velocidad</div>
                            <div className="qcard-value">&mdash;</div>
                            <div className="qcard-sub">Ir a herramientas</div>
                            <div className="qcard-link">Hacer test &rarr;</div>
                        </div>
                        <div className="qcard" onClick={() => navigate('/portal/red')}>
                            <div className="qcard-icon"><Activity size={20} /></div>
                            <div className="qcard-label">Estado de Red</div>
                            <div className="qcard-value text-normal">Estable</div>
                            <div className="qcard-sub">Conexión local</div>
                            <div className="qcard-link">Ver latencia &rarr;</div>
                        </div>
                    </div>

                    <div className="history-banner">
                        <div className="history-info">
                            <strong>Últimos movimientos</strong>
                            <span>Revisa tus facturas y recibos de pago anteriores.</span>
                        </div>
                        <button className="btn-history" onClick={() => navigate('/portal/historial')}>
                            Ver historial
                        </button>
                    </div>

                </div>

                <div className="sidebar">

                    <div className="scard">
                        <div className="scard-title">Cuenta</div>
                        <div className="billing-row">
                            <span className="bkey">Mensualidad</span>
                            <span className="bval">{formatCurrency(perfil.saldo_actual)}</span>
                        </div>
                        {Number(perfil.deuda_historica) > 0 && (
                            <div className="billing-row">
                                <span className="bkey text-red">Deuda atrasada</span>
                                <span className="bval text-red">{formatCurrency(perfil.deuda_historica)}</span>
                            </div>
                        )}
                        {Number(perfil.saldo_aplazado) > 0 && (
                            <div className="billing-row">
                                <span className="bkey text-red">Saldo aplazado</span>
                                <span className="bval text-red">{formatCurrency(perfil.saldo_aplazado)}</span>
                            </div>
                        )}
                        <div className="billing-row">
                            <span className="bkey">Período</span>
                            <span className="bval" style={{textTransform: 'capitalize'}}>{mesActual}</span>
                        </div>
                        <div className="total-block">
                            <div className="total-lbl">Total a pagar</div>
                            <div className="total-num">{formatCurrency(saldoTotal)}</div>
                        </div>
                        
                        <button 
                            className="btn-primary" 
                            onClick={() => setShowPagoModal(true)}
                            disabled={isPaying}
                        >
                            {isPaying ? 'Generando...' : 'Generar link de pago'}
                        </button>

                        {isSuspendido && Number(perfil.saldo_aplazado) === 0 && (
                            <button 
                                className="btn-secondary" 
                                onClick={() => setShowProrrogaModal(true)}
                            >
                                Solicitar prórroga
                            </button>
                        )}
                    </div>

                    <div className="scard">
                        <div className="scard-title">Mi equipo</div>
                        <div className="equip-row">
                            <span className="ekey">IP Asignada</span>
                            <span className="eval">{perfil.ip_asignada || 'N/A'}</span>
                        </div>
                        <div className="equip-row">
                            <span className="ekey">N.º Suscriptor</span>
                            <span className="eval">{perfil.numero_suscriptor}</span>
                        </div>
                        <div className="equip-row">
                            <span className="ekey">Estado</span>
                            <span className={`eval status-indicator ${isSuspendido ? 'text-red' : 'text-green'}`}>
                                ● {isSuspendido ? 'Offline' : 'Online'}
                            </span>
                        </div>
                    </div>

                    <div className="scard compact">
                        <div className="scard-title">Soporte</div>
                        <div className="support-link" onClick={() => navigate('/portal/soporte')}>
                            <div className="sl-icon"><Headphones size={18} /></div>
                            <div className="sl-text">
                                <strong>Centro de ayuda</strong>
                                <span>¿Algo no funciona? Escríbenos.</span>
                            </div>
                        </div>
                        <div className="support-link" onClick={() => navigate('/portal/soporte')}>
                            <div className="sl-icon"><MessageSquare size={18} /></div>
                            <div className="sl-text">
                                <strong>Mis Tickets</strong>
                                <span>Revisar respuestas técnicas.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <ModalProrroga 
                isOpen={showProrrogaModal}
                onClose={() => setShowProrrogaModal(false)}
                onConfirm={handleAplazarPago}
                isProcessing={isAplazando}
            />  

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