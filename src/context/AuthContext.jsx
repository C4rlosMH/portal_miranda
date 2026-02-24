import { createContext, useState, useContext } from 'react';

// Creamos el contexto
const AuthContext = createContext();

// Creamos el proveedor que envolverá nuestra aplicación
export const AuthProvider = ({ children }) => {
    // Buscamos si ya existe un token guardado previamente
    const [token, setToken] = useState(localStorage.getItem('portal_token'));

    const login = (newToken) => {
        localStorage.setItem('portal_token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('portal_token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            login, 
            logout, 
            isAuthenticated: !!token // Si hay token es true, si es null es false
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);