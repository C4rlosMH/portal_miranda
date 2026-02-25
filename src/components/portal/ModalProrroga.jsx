import './styles/ModalProrroga.scss';

export const ModalProrroga = ({ isOpen, onClose, onConfirm, isProcessing }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Solicitar Prórroga</h3>
                <p className="modal-text">
                    Al solicitar una prórroga, tu saldo actual se pasará al siguiente mes y tu servicio se reactivará de forma inmediata en el sistema. 
                    <br /><br />
                    Nota: Debes liquidar el saldo aplazado antes de poder solicitar una nueva prórroga. ¿Deseas continuar?
                </p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isProcessing}>
                        Cancelar
                    </button>
                    <button className="btn-confirm" onClick={onConfirm} disabled={isProcessing}>
                        {isProcessing ? 'Procesando...' : 'Sí, aplazar pago'}
                    </button>
                </div>
            </div>
        </div>
    );
};