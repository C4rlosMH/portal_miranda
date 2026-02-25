import { useState } from 'react';
import { X, Wifi, Activity, Receipt, MessageSquare, Send } from 'lucide-react';
import api from '../../api/axios';
import './styles/ModalNuevoTicket.scss';

export const ModalNuevoTicket = ({ isOpen, onClose, onTicketCreated }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        categoria: 'Sin conexión',
        prioridad: 'BAJA',
        asunto: '',
        descripcion: ''
    });

    if (!isOpen) return null;

    const categorias = [
        { id: 'Sin conexión', label: 'Sin conexión', desc: 'No tengo internet', icon: <Wifi size={18}/> },
        { id: 'Internet lento', label: 'Internet lento', desc: 'Velocidad reducida', icon: <Activity size={18}/> },
        { id: 'Facturación', label: 'Facturación', desc: 'Pagos o cobros', icon: <Receipt size={18}/> },
        { id: 'Otro', label: 'Otro', desc: 'Consulta general', icon: <MessageSquare size={18}/> },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/portal/tickets', formData);
            setFormData({ categoria: 'Sin conexión', prioridad: 'BAJA', asunto: '', descripcion: '' });
            onTicketCreated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Error al enviar");
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="modal-overlay modal-nuevo-v2">
            <div className="modal-content">
                <div className="modal-header" style={{border: 'none', background: 'transparent', padding: 0, marginBottom: '1.5rem'}}>
                    <div>
                        <div className="modal-subtitle">NUEVO TICKET</div>
                        <h3 className="modal-title">¿Qué problema tenés?</h3>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="categorias-grid">
                        {categorias.map(cat => (
                            <div 
                                key={cat.id} 
                                className={`cat-card ${formData.categoria === cat.id ? 'active' : ''}`}
                                onClick={() => setFormData({...formData, categoria: cat.id})}
                            >
                                <div className="cat-icon">{cat.icon}</div>
                                <div className="cat-info">
                                    <strong>{cat.label}</strong>
                                    <span>{cat.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-group">
                        <label>Asunto <span className="field-note">— Breve descripción del problema</span></label>
                        <input 
                            type="text" 
                            placeholder="Ej: El router tiene la luz roja desde esta mañana"
                            value={formData.asunto}
                            onChange={(e) => setFormData({...formData, asunto: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción detallada</label>
                        <textarea 
                            placeholder="Contanos cuándo empezó, qué intentaste hacer..."
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            maxLength={500}
                            required
                        />
                        <div className="char-count">{formData.descripcion.length} / 500</div>
                    </div>

                    <div className="form-group">
                        <label>Prioridad</label>
                        <div className="prioridad-grid">
                            {['BAJA', 'MEDIA', 'ALTA'].map(p => (
                                <div 
                                    key={p}
                                    className={`prio-btn ${p.toLowerCase()} ${formData.prioridad === p ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, prioridad: p})}
                                >
                                    <div className="prio-dot"></div>
                                    {p.charAt(0) + p.slice(1).toLowerCase()}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions" style={{marginTop: '2rem', border: 'none', background: 'transparent', padding: 0}}>
                        <button type="button" className="btn-secondary" style={{border: 'none'}} onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-primary" style={{padding: '0.8rem 2rem'}} disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar ticket →'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};