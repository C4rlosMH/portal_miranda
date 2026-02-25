import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { TopNav } from '../../components/portal/TopNav';

import './styles/DashboardCliente.scss';
import './styles/Perfil.scss';

export const Perfil = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Estados generales
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Datos del cliente traídos del backend
    const [perfilOriginal, setPerfilOriginal] = useState(null);

    // Estados para Formulario de Contacto
    const [perfilData, setPerfilData] = useState({ email: '', telefono: '' });
    const [isUpdatingPerfil, setIsUpdatingPerfil] = useState(false);

    // Estados para Seguridad (Contraseña)
    const [passwords, setPasswords] = useState({ password_actual: '', nueva_password: '', confirmar_password: '' });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    
    // Visibilidad de contraseñas
    const [showPwActual, setShowPwActual] = useState(false);
    const [showPwNueva, setShowPwNueva] = useState(false);
    const [showPwConf, setShowPwConf] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const response = await api.get('/portal/dashboard');
                const data = response.data;
                setPerfilOriginal(data);
                setPerfilData({
                    email: data.email || '',
                    telefono: data.telefono || ''
                });
            } catch (err) {
                setGlobalError("No pudimos cargar tu información.");
                if (err.response?.status === 401) logout();
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, [logout]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 5000);
    };

    // --- MANEJADORES DE PERFIL ---
    const handlePerfilChange = (e) => setPerfilData({ ...perfilData, [e.target.name]: e.target.value });

    const handleActualizarPerfil = async (e) => {
        e.preventDefault();
        setIsUpdatingPerfil(true);
        setGlobalError(null);
        setSuccessMsg(null);

        try {
            await api.put('/portal/perfil', { email: perfilData.email, telefono: perfilData.telefono });
            // Actualizamos la copia original para que el botón Cancelar funcione con los nuevos datos
            setPerfilOriginal(prev => ({ ...prev, email: perfilData.email, telefono: perfilData.telefono }));
            showSuccess("Tus datos de contacto han sido actualizados correctamente.");
        } catch (err) {
            setGlobalError(err.response?.data?.message || "Error al actualizar datos.");
        } finally {
            setIsUpdatingPerfil(false);
        }
    };

    const handleCancelarPerfil = (e) => {
        e.preventDefault();
        setPerfilData({ email: perfilOriginal.email || '', telefono: perfilOriginal.telefono || '' });
    };

    // --- MANEJADORES DE CONTRASEÑA ---
    const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleActualizarPassword = async (e) => {
        e.preventDefault();
        setGlobalError(null);
        setSuccessMsg(null);

        if (passwords.nueva_password !== passwords.confirmar_password) {
            setGlobalError("Las contraseñas nuevas no coinciden.");
            return;
        }

        setIsUpdatingPassword(true);

        try {
            await api.put('/portal/password', {
                password_actual: passwords.password_actual,
                nueva_password: passwords.nueva_password
            });
            showSuccess("Tu contraseña ha sido actualizada por seguridad.");
            setPasswords({ password_actual: '', nueva_password: '', confirmar_password: '' });
        } catch (err) {
            setGlobalError(err.response?.data?.message || "Error al cambiar la contraseña.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleCancelarPassword = (e) => {
        e.preventDefault();
        setPasswords({ password_actual: '', nueva_password: '', confirmar_password: '' });
    };

    // Lógica para el medidor de fuerza
    const calculateStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const pwScore = calculateStrength(passwords.nueva_password);
    const levels = ['weak', 'medium', 'medium', 'strong'];
    const labels = ['Débil', 'Regular', 'Buena', 'Muy segura'];
    const pwClass = levels[pwScore - 1] || 'weak';
    const hasPassword = passwords.nueva_password.length > 0;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
            <div className="text-blue-600 font-semibold text-lg">Cargando tu perfil...</div>
        </div>
    );

    const isSuspendido = perfilOriginal?.estado === 'SUSPENDIDO';

    return (
        <div className="dashboard-v2-wrapper perfil-v2-wrapper">
            <TopNav userName={perfilOriginal?.nombre_completo} />

            <main className="page-content">
                
                <div className="page-header">
                    <button onClick={() => navigate('/portal/dashboard')} className="back-btn">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="page-title">Mi perfil</h1>
                </div>

                {globalError && (
                    <div className="alert-message error" style={{ animation: 'up 0.4s ease' }}>
                        <AlertCircle size={20} /> <p>{globalError}</p>
                    </div>
                )}
                {successMsg && (
                    <div className="alert-message success" style={{ animation: 'up 0.4s ease' }}>
                        <CheckCircle size={20} /> <p>{successMsg}</p>
                    </div>
                )}

                {/* HERO DEL PERFIL */}
                <div className="profile-hero">
                    <div className="avatar-big">
                        {perfilOriginal?.nombre_completo?.substring(0, 2).toUpperCase() || 'CP'}
                    </div>
                    <div className="profile-info">
                        <h2>{perfilOriginal?.nombre_completo}</h2>
                        <p>N.º Suscriptor: {perfilOriginal?.numero_suscriptor}</p>
                        <div className="profile-tags">
                            <span className={`tag ${isSuspendido ? 'red' : 'green'}`}>
                                <span className="tag-dot"></span>{isSuspendido ? 'Servicio suspendido' : 'Servicio activo'}
                            </span>
                            <span className="tag blue">{perfilOriginal?.plan?.nombre || 'Plan Básico'}</span>
                        </div>
                    </div>
                </div>

                {/* FORMULARIO: DATOS PERSONALES */}
                <form className="scard" onSubmit={handleActualizarPerfil} style={{ animation: 'up 0.4s 0.1s ease both' }}>
                    <div className="scard-header">
                        <User size={18} className="scard-header-icon" />
                        <span className="scard-header-title">Información personal</span>
                    </div>
                    <div className="scard-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Titular de la cuenta <span className="field-note">Solo lectura</span></label>
                                <input type="text" value={perfilOriginal?.nombre_completo || ''} disabled />
                            </div>
                            <div className="form-group">
                                <label>N.º Suscriptor <span className="field-note">Solo lectura</span></label>
                                <input type="text" value={perfilOriginal?.numero_suscriptor || ''} disabled />
                            </div>
                            <div className="form-group">
                                <label>Correo electrónico</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={perfilData.email} 
                                    onChange={handlePerfilChange} 
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono / WhatsApp</label>
                                <input 
                                    type="tel" 
                                    name="telefono" 
                                    value={perfilData.telefono} 
                                    onChange={handlePerfilChange} 
                                    placeholder="10 dígitos"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancelarPerfil} disabled={isUpdatingPerfil}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isUpdatingPerfil}>
                            {isUpdatingPerfil ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>

                {/* FORMULARIO: SEGURIDAD */}
                <form className="scard" onSubmit={handleActualizarPassword} style={{ animation: 'up 0.4s 0.15s ease both' }}>
                    <div className="scard-header">
                        <Shield size={18} className="scard-header-icon" />
                        <span className="scard-header-title">Seguridad y acceso</span>
                    </div>
                    <div className="scard-body">
                        <div className="form-grid">
                            <div className="form-group full">
                                <label>Contraseña actual</label>
                                <div className="input-wrap">
                                    <input 
                                        type={showPwActual ? "text" : "password"} 
                                        name="password_actual" 
                                        value={passwords.password_actual} 
                                        onChange={handlePasswordChange} 
                                        placeholder="Ingresa tu contraseña actual" 
                                        required
                                    />
                                    <div className="input-eye" onClick={() => setShowPwActual(!showPwActual)}>
                                        {showPwActual ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Nueva contraseña</label>
                                <div className="input-wrap">
                                    <input 
                                        type={showPwNueva ? "text" : "password"} 
                                        name="nueva_password" 
                                        value={passwords.nueva_password} 
                                        onChange={handlePasswordChange} 
                                        placeholder="Mínimo 8 caracteres" 
                                        minLength="8"
                                        required
                                    />
                                    <div className="input-eye" onClick={() => setShowPwNueva(!showPwNueva)}>
                                        {showPwNueva ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </div>
                                </div>
                                {hasPassword && (
                                    <>
                                        <div className="pw-strength">
                                            {[1, 2, 3, 4].map(num => (
                                                <div key={num} className={`pw-bar ${pwScore >= num ? `active ${pwClass}` : ''}`}></div>
                                            ))}
                                        </div>
                                        <div className="pw-label" style={{ color: pwScore <= 1 ? 'var(--red-main)' : pwScore <= 2 ? '#f59e0b' : 'var(--green-main)' }}>
                                            {labels[pwScore - 1]}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Confirmar nueva contraseña</label>
                                <div className="input-wrap">
                                    <input 
                                        type={showPwConf ? "text" : "password"} 
                                        name="confirmar_password" 
                                        value={passwords.confirmar_password} 
                                        onChange={handlePasswordChange} 
                                        placeholder="Repite la nueva contraseña" 
                                        minLength="8"
                                        required
                                    />
                                    <div className="input-eye" onClick={() => setShowPwConf(!showPwConf)}>
                                        {showPwConf ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={handleCancelarPassword} disabled={isUpdatingPassword}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isUpdatingPassword || !passwords.password_actual || !passwords.nueva_password}>
                            {isUpdatingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </div>
                </form>

            </main>
        </div>
    );
};