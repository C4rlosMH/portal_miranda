export const AppConfig = {
    // Identidad del Sistema
    appName: "Miranda Net",
    companyName: "Telecomunicaciones Miranda",
    
    // Formato de Moneda y Regionalización
    currencySymbol: "$",
    currencyCode: "MXN",
    locale: "es-MX",
    
    // Datos de Contacto Publicos
    supportPhone: import.meta.env.VITE_SUPPORT_PHONE, 
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER,
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL,
    
    // Redes Sociales (Para el footer de la landing page)
    socialLinks: {
        facebook: import.meta.env.VITE_FACEBOOK_URL,
        whatsapp: import.meta.env.VITE_WHATSAPP_URL
    },

    // Configuracion de UI
    theme: {
        // Aquí podemos definir los colores principales por si el cliente los quiere cambiar
        primaryColor: "blue",
    }
};