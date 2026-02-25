import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import api from '../../api/axios';
import { AppConfig } from '../../config/app.config';
import './styles/ModalDetalleTicket.scss';

export const ModalDetalleTicket = ({ isOpen, onClose, ticket }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(false);
    
    const mensajesEndRef = useRef(null);

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(AppConfig.locale, options);
    };

    const fetchMensajes = async () => {
        if (!ticket) return;
        setLoadingMsg(true);
        try {
            const response = await api.get(`/portal/tickets/${ticket.id}/mensajes`);
            setMensajes(response.data);
            scrollToBottom();
        } catch (error) {
            console.error("Error al cargar mensajes", error);
        } finally {
            setLoadingMsg(false);
        }
    };

    useEffect(() => {
        if (isOpen && ticket) {
            fetchMensajes();
        } else {
            setMensajes([]);
        }
    }, [isOpen, ticket]);

    const scrollToBottom = () => {
        setTimeout(() => {
            mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim()) return;

        setIsSending(true);
        try {
            await api.post(`/portal/tickets/${ticket.id}/mensajes`, {
                mensaje: nuevoMensaje
            });
            setNuevoMensaje("");
            await fetchMensajes(); 
        } catch (error) {
            console.error("Error al enviar mensaje", error);
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen || !ticket) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-chat-content">
                
                <div className="chat-header">
                    <div className="chat-title-area">
                        <h3 className="ticket-asunto">#{String(ticket.id).padStart(4, '0')} - {ticket.asunto}</h3>
                        <div className="ticket-meta">
                            {ticket.categoria} • Estado: {ticket.estado.replace('_', ' ')}
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <div className="chat-body">
                    <div className="descripcion-original">
                        <div className="desc-label">Reporte inicial</div>
                        <div className="desc-text">{ticket.descripcion}</div>
                    </div>

                    {loadingMsg && <div style={{ textAlign: 'center', color: 'var(--muted-miranda)', fontSize: '0.85rem' }}>Cargando conversación...</div>}

                    {mensajes.map((msg) => {
                        const isCliente = msg.remitente === 'CLIENTE';
                        return (
                            <div key={msg.id} className={`mensaje-wrapper ${isCliente ? 'align-right' : 'align-left'}`}>
                                <div className={`mensaje-burbuja ${isCliente ? 'burbuja-cliente' : 'burbuja-admin'}`}>
                                    {msg.mensaje}
                                </div>
                                <div className="mensaje-fecha">
                                    {formatTime(msg.fecha_creacion)}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={mensajesEndRef} />
                </div>

                <div className="chat-footer">
                    <form onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder={ticket.estado === 'CERRADO' || ticket.estado === 'RESUELTO' ? "Escribe para reabrir el ticket..." : "Escribe una respuesta..."}
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            disabled={isSending}
                        />
                        <button type="submit" className="btn-enviar" disabled={!nuevoMensaje.trim() || isSending}>
                            {isSending ? '...' : <Send size={16} />}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};