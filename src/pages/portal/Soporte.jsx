import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Ticket as TicketIcon, ArrowLeft, Plus, AlertCircle, 
    ChevronLeft, ChevronRight, ArrowRight, WifiOff, 
    Activity, Receipt, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';

import { TopNav } from '../../components/portal/TopNav';
import { ModalNuevoTicket } from '../../components/portal/ModalNuevoTicket';
import { ModalDetalleTicket } from '../../components/portal/ModalDetalleTicket';

import './styles/DashboardCliente.scss'; 
import './styles/Soporte.scss';

export const Soporte = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

    // Estados para la UI
    const [filtro, setFiltro] = useState('ALL'); // ALL, ABIERTO, EN_PROGRESO, RESUELTO
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 5;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(AppConfig.locale, options);
    };

    const fetchTickets = async () => {
        try {
            const response = await api.get('/portal/tickets');
            setTickets(response.data);
            setCurrentPage(1); 
        } catch (err) {
            setError("No pudimos cargar tu historial de tickets.");
            if (err.response?.status === 401) logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [logout]);

    const getIconoCategoria = (cat) => {
        if (cat.includes('conexi')) return <WifiOff size={18} />;
        if (cat.includes('lento')) return <Activity size={18} />;
        if (cat.includes('facturacion') || cat.includes('pagos')) return <Receipt size={18} />;
        return <MessageSquare size={18} />;
    };

    const getEstadoUI = (estado) => {
        switch (estado) {
            case 'ABIERTO': return { clase: 'open', texto: 'Abierto' };
            case 'EN_PROGRESO': return { clase: 'in-progress', texto: 'En progreso' };
            case 'CERRADO': 
            case 'RESUELTO': return { clase: 'resolved', texto: 'Resuelto' };
            default: return { clase: 'open', texto: estado };
        }
    };

    const handleFiltro = (nuevoFiltro) => {
        setFiltro(nuevoFiltro);
        setCurrentPage(1); // Volver a la página 1 al cambiar de filtro
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-blue-600 font-semibold text-lg">Cargando soporte...</div>
            </div>
        );
    }

    // Cálculos estadísticos
    const statsAbiertos = tickets.filter(t => t.estado === 'ABIERTO' || t.estado === 'EN_PROGRESO').length;
    const statsResueltos = tickets.filter(t => t.estado === 'RESUELTO' || t.estado === 'CERRADO').length;

    // Filtrar y Paminar
    const ticketsFiltrados = tickets.filter(t => {
        if (filtro === 'ALL') return true;
        if (filtro === 'ABIERTO') return t.estado === 'ABIERTO';
        if (filtro === 'EN_PROGRESO') return t.estado === 'EN_PROGRESO';
        if (filtro === 'RESUELTO') return t.estado === 'RESUELTO' || t.estado === 'CERRADO';
        return true;
    });

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = ticketsFiltrados.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(ticketsFiltrados.length / ticketsPerPage);

    return (
        <div className="dashboard-v2-wrapper soporte-v2-wrapper">
            <TopNav userName={user?.nombre || "Mi Perfil"} />

            <main className="page-content">
                
                <div className="page-header">
                    <div className="page-header-left">
                        <button className="back-btn" onClick={() => navigate('/portal/dashboard')}>
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="page-title">Soporte técnico</h1>
                    </div>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={16} /> Nuevo ticket
                    </button>
                </div>

                {error && (
                    <div className="alert-message error" style={{marginBottom: '1.5rem'}}>
                        <AlertCircle size={20} /> <p>{error}</p>
                    </div>
                )}

                {/* ESTADÍSTICAS */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-label">Total de tickets</div>
                        <div className="stat-value">{tickets.length}</div>
                        <div className="stat-sub">Historial completo</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Abiertos</div>
                        <div className="stat-value orange">{statsAbiertos}</div>
                        <div className="stat-sub">Esperando respuesta</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Resueltos</div>
                        <div className="stat-value green">{statsResueltos}</div>
                        <div className="stat-sub">Histórico</div>
                    </div>
                </div>

                {/* FILTROS */}
                <div className="filters-row">
                    <button className={`filter-btn ${filtro === 'ALL' ? 'active' : ''}`} onClick={() => handleFiltro('ALL')}>Todos</button>
                    <button className={`filter-btn ${filtro === 'ABIERTO' ? 'active' : ''}`} onClick={() => handleFiltro('ABIERTO')}>Abiertos</button>
                    <button className={`filter-btn ${filtro === 'EN_PROGRESO' ? 'active' : ''}`} onClick={() => handleFiltro('EN_PROGRESO')}>En progreso</button>
                    <button className={`filter-btn ${filtro === 'RESUELTO' ? 'active' : ''}`} onClick={() => handleFiltro('RESUELTO')}>Resueltos</button>
                </div>

                {/* LISTA */}
                <div className="tickets-wrap">
                    {ticketsFiltrados.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><TicketIcon size={48} /></div>
                            <div className="empty-title">No hay tickets en esta categoría</div>
                            <div className="empty-sub">Todo parece estar en orden por acá.</div>
                        </div>
                    ) : (
                        <>
                            {currentTickets.map(ticket => {
                                const ui = getEstadoUI(ticket.estado);
                                const isUnread = ticket.tiene_mensajes_nuevos; // Leemos la novedad

                                return (
                                    <div key={ticket.id} className={`ticket-card ${ui.clase} ${isUnread ? 'unread-ticket' : ''}`} onClick={() => setTicketSeleccionado(ticket)}>
                                        <div className="ticket-main">
                                            <div className="ticket-icon">
                                                {getIconoCategoria(ticket.categoria)}
                                            </div>
                                            <div className="ticket-body">
                                                <div className="ticket-top">
                                                    <div className="ticket-title">
                                                        {isUnread && <span className="dot-new-client" title="Nuevo mensaje del equipo de soporte"></span>}
                                                        {ticket.asunto}
                                                    </div>
                                                    <span className={`badge ${ui.clase}`}>
                                                        <span className="badge-dot"></span>{ui.texto}
                                                    </span>
                                                </div>
                                                <div className="ticket-meta">
                                                    <span>{ticket.categoria}</span>
                                                    <span className="meta-sep">·</span>
                                                    <span>{formatDate(ticket.fecha_creacion)}</span>
                                                </div>
                                                <div className="ticket-preview">
                                                    {isUnread ? <strong style={{color: '#2563eb'}}>¡Tienes una nueva respuesta!</strong> : ticket.descripcion}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ticket-footer">
                                            <div className="ticket-footer-left">
                                                <span className="ticket-id">#{String(ticket.id).padStart(4, '0')}</span>
                                                {ticket.estado !== 'RESUELTO' && ticket.estado !== 'CERRADO' && (
                                                    <span>Última actividad: {formatDate(ticket.fecha_actividad || ticket.fecha_actualizacion || ticket.fecha_creacion)}</span>
                                                )}
                                                {(ticket.estado === 'RESUELTO' || ticket.estado === 'CERRADO') && (
                                                    <span>Cerrado el {formatDate(ticket.fecha_actualizacion)}</span>
                                                )}
                                            </div>
                                            <ArrowRight size={16} className="ticket-arrow" />
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* CONTROLES DE PAGINACIÓN */}
                            {totalPages > 1 && (
                                <div className="pagination-controls">
                                    <div className="page-info">
                                        Mostrando {indexOfFirstTicket + 1} a {Math.min(indexOfLastTicket, ticketsFiltrados.length)} de {ticketsFiltrados.length} tickets
                                    </div>
                                    <div className="pagination-actions">
                                        <button className="page-btn" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                            <ChevronLeft size={16} /> Anterior
                                        </button>
                                        <button className="page-btn" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                            Siguiente <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </main>

            <ModalNuevoTicket 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onTicketCreated={fetchTickets}
            />

            <ModalDetalleTicket 
                isOpen={!!ticketSeleccionado}
                onClose={() => {
                    setTicketSeleccionado(null);
                    fetchTickets();
                }}
                ticket={ticketSeleccionado}
            />
        </div>
    );
};