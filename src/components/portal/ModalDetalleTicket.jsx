import { useState, useEffect, useRef } from 'react';
import { X, Send, Star, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import { AppConfig } from '../../config/app.config';
import './styles/ModalDetalleTicket.scss';

export const ModalDetalleTicket = ({ isOpen, onClose, ticket }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState(false);
    
    // --- ESTADOS PARA LA CALIFICACIÓN ---
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comentarioCalificacion, setComentarioCalificacion] = useState("");
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [calificacionEnviada, setCalificacionEnviada] = useState(false);

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
            // Cargar datos de calificación si ya existen
            setCalificacionEnviada(!!ticket.calificacion);
            setRating(ticket.calificacion || 0);
            setComentarioCalificacion(ticket.comentario_calificacion || "");
        } else {
            setMensajes([]);
            setRating(0);
            setComentarioCalificacion("");
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

    // --- FUNCIÓN PARA ENVIAR CALIFICACIÓN ---
    const handleSubmitRating = async () => {
        if (rating < 1 || rating > 5) return;
        setIsSubmittingRating(true);
        try {
            // Asegúrate de que esta ruta exista en tu backend para el portal del cliente
            await api.put(`/portal/tickets/${ticket.id}/calificar`, {
                calificacion: rating,
                comentario: comentarioCalificacion
            });
            setCalificacionEnviada(true);
        } catch (error) {
            console.error("Error al calificar", error);
        } finally {
            setIsSubmittingRating(false);
        }
    };

    if (!isOpen || !ticket) return null;

    const estaCerrado = ticket.estado === 'CERRADO' || ticket.estado === 'RESUELTO';

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

                    {/* --- CAJA DE SOLUCIÓN DEL ADMINISTRADOR --- */}
                    {estaCerrado && ticket.solucion && (
                        <div className="solucion-admin-box">
                            <div className="solucion-header">
                                <CheckCircle size={16} /> Solución aplicada
                            </div>
                            <div className="solucion-text">{ticket.solucion}</div>
                        </div>
                    )}

                    {/* --- SISTEMA DE CALIFICACIÓN --- */}
                    {estaCerrado && (
                        <div className="calificacion-box">
                            {!calificacionEnviada ? (
                                <div className="calificacion-prompt">
                                    <h4>¿Qué te pareció nuestro servicio?</h4>
                                    <p>Tu opinión nos ayuda a mejorar.</p>
                                    
                                    <div className="stars-container">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star}
                                                size={32}
                                                className={`star-icon ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                            />
                                        ))}
                                    </div>

                                    {rating > 0 && (
                                        <div className="calificacion-form fade-in">
                                            <textarea 
                                                placeholder="Cuéntanos más sobre tu experiencia (opcional)..."
                                                value={comentarioCalificacion}
                                                onChange={(e) => setComentarioCalificacion(e.target.value)}
                                                rows="3"
                                            />
                                            <button 
                                                className="btn-enviar-calificacion" 
                                                onClick={handleSubmitRating} 
                                                disabled={isSubmittingRating}
                                            >
                                                {isSubmittingRating ? 'Enviando...' : 'Enviar calificación'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="calificacion-gracias">
                                    <h4>¡Gracias por tu valoración!</h4>
                                    <div className="stars-display">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star}
                                                size={20}
                                                className={`star-icon ${star <= rating ? 'active' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    {comentarioCalificacion && (
                                        <p className="comentario-dejado">"{comentarioCalificacion}"</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div ref={mensajesEndRef} />
                </div>

                <div className="chat-footer">
                    <form onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder={estaCerrado ? "Escribe para reabrir el ticket..." : "Escribe una respuesta..."}
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