import { useState, useEffect } from 'react';
import { LogOut, Sun, Moon, Wifi, CreditCard, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { AppConfig } from '../../config/app.config';
import api from '../../api/axios';
import './styles/DashboardCliente.scss';

export const DashboardCliente = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    
    // Estados para guardar la informacion del servidor
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formateador de moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(AppConfig.locale, {
            style: 'currency',
            currency: AppConfig.currencyCode
        }).format(amount || 0);
    };

    // Llamada al servidor al cargar la pantalla
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/auth/cliente/dashboard'); // Ajusta la ruta si es diferente en tu backend
                setPerfil(response.data);
            } catch (err) {
                setError("No pudimos cargar tu informacion. Por favor, recarga la pagina.");
                if (err.response?.status === 401) {
                    logout(); // Si el token expiro, lo sacamos
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [logout]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-blue-600 font-semibold text-lg">Cargando tu informacion...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            {/* Barra de Navegacion Superior */}
            <nav className="navbar">
                <div className="brand">
                    <Wifi size={24} />
                    <span>{AppConfig.appName}</span>
                </div>
                <div className="nav-actions">
                    <button onClick={toggleTheme} className="icon-btn" aria-label="Cambiar tema">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={logout} className="icon-btn logout-btn" aria-label="Cerrar sesion">
                        <LogOut size={20} />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </nav>

            {/* Contenido Principal */}
            <main className="dashboard-content">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-center gap-2">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {perfil && (
                    <>
                        <section className="welcome-section">
                            <h2>Hola, {perfil.nombre_completo}</h2>
                            <p>Numero de Suscriptor: {perfil.numero_suscriptor}</p>
                        </section>

                        <div className="grid-container">
                            {/* Tarjeta de Servicio */}
                            <div className="card">
                                <div className="card-header">
                                    <User size={24} />
                                    <h3>Estado del Servicio</h3>
                                </div>
                                <div className="info-row">
                                    <span className="label">Estatus Actual</span>
                                    <span className={`badge ${perfil.estado === 'ACTIVO' ? 'active' : 'suspended'}`}>
                                        {perfil.estado}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Plan Contratado</span>
                                    <span className="value">{perfil.plan?.nombre || 'Sin plan asignado'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">IP Asignada</span>
                                    <span className="value">{perfil.ip_asignada || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Tarjeta Financiera */}
                            <div className="card">
                                <div className="card-header">
                                    <CreditCard size={24} />
                                    <h3>Resumen Financiero</h3>
                                </div>
                                <div className="info-row">
                                    <span className="label">Saldo Mensualidad</span>
                                    <span className="value amount">{formatCurrency(perfil.saldo_actual)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Saldo Aplazado</span>
                                    <span className="value amount">{formatCurrency(perfil.saldo_aplazado)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Deuda Historica</span>
                                    <span className="value amount text-red-500">{formatCurrency(perfil.deuda_historica)}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};