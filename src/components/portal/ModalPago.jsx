import { useState } from 'react';
import { X } from 'lucide-react';
import { AppConfig } from '../../config/app.config';
import './styles/ModalPago.scss';

export const ModalPago = ({ isOpen, onClose, perfil, onConfirm, isProcessing }) => {
    const [tipoSeleccionado, setTipoSeleccionado] = useState('TOTAL'); // 'TOTAL' o 'PARCIAL'
    const [montoPersonalizado, setMontoPersonalizado] = useState('');

    if (!isOpen || !perfil) return null;

    const saldoTotal = (Number(perfil.saldo_actual) + Number(perfil.deuda_historica) + Number(perfil.saldo_aplazado));
    const tieneDeuda = saldoTotal > 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(AppConfig.locale, {
            style: 'currency',
            currency: AppConfig.currencyCode
        }).format(amount || 0);
    };

    const handleAceptar = () => {
        if (tipoSeleccionado === 'TOTAL') {
            // Replicamos la logica original: saber si es mensualidad o deuda atrasada
            const tipoOriginal = (Number(perfil.deuda_historica) > 0 || perfil.estado === 'SUSPENDIDO') 
                ? 'DEUDA_TOTAL' 
                : 'MENSUALIDAD';
            
            onConfirm({ tipo_pago: tipoOriginal });
        } else {
            // Enviamos el monto exacto ingresado
            onConfirm({ 
                tipo_pago: 'PARCIAL', 
                monto: parseFloat(montoPersonalizado) 
            });
        }
    };

    const isValid = tipoSeleccionado === 'TOTAL' || (parseFloat(montoPersonalizado) > 0);

    return (
        <div className="modal-overlay">
            <div className="modal-pago-content">
                <div className="modal-header">
                    <h3>Opciones de pago</h3>
                    <button className="close-btn" onClick={onClose} disabled={isProcessing}>
                        <X size={20} />
                    </button>
                </div>

                <div className="opciones-pago">
                    {/* Opción 1: Pagar Todo */}
                    <div 
                        className={`opcion-card ${tipoSeleccionado === 'TOTAL' ? 'selected' : ''}`}
                        onClick={() => setTipoSeleccionado('TOTAL')}
                    >
                        <div className="opcion-header">
                            <span className="opcion-title">Liquidar saldo total</span>
                            <div className={`opcion-radio ${tipoSeleccionado === 'TOTAL' ? 'active' : ''}`}></div>
                        </div>
                        <div className="opcion-desc">
                            Monto exacto a pagar: <strong>{formatCurrency(saldoTotal)}</strong>
                        </div>
                    </div>

                    {/* Opción 2: Otro Monto */}
                    <div 
                        className={`opcion-card ${tipoSeleccionado === 'PARCIAL' ? 'selected' : ''}`}
                        onClick={() => setTipoSeleccionado('PARCIAL')}
                    >
                        <div className="opcion-header">
                            <span className="opcion-title">Abonar otro monto</span>
                            <div className={`opcion-radio ${tipoSeleccionado === 'PARCIAL' ? 'active' : ''}`}></div>
                        </div>
                        <div className="opcion-desc">
                            Ingresa una cantidad personalizada
                        </div>

                        {tipoSeleccionado === 'PARCIAL' && (
                            <div className="custom-amount-wrap" onClick={(e) => e.stopPropagation()}>
                                <label>¿Cuánto deseas pagar?</label>
                                <div className="input-prefix">
                                    <span>$</span>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        step="0.01" 
                                        placeholder="0.00" 
                                        value={montoPersonalizado}
                                        onChange={(e) => setMontoPersonalizado(e.target.value)}
                                        disabled={isProcessing}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isProcessing}>
                        Cancelar
                    </button>
                    <button 
                        className="btn-confirm" 
                        onClick={handleAceptar} 
                        disabled={!isValid || isProcessing || !tieneDeuda}
                    >
                        {isProcessing ? 'Generando...' : 'Continuar a pagar'}
                    </button>
                </div>
            </div>
        </div>
    );
};