// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      // Navbar
      home: "Inicio",
      menu: "Menú",
      about: "Nosotros",
      contact: "Contacto",
      logout: "Salir",

      // Menú
      menuDescription: "Platos para el almuerzo",
      deliciousProduct: "Delicioso producto",
      addToCart: "Agregar al Carrito",
      yourCart: "Tu Carrito",
      emptyCart: "Tu carrito está vacío",
      total: "Total",
      remove: "Eliminar",
      proceedPayment: "Proceder al Pago",

      // QR
      scanToPay: "Escanea para Pagar",
      qrCode: "Código QR de pago",
      totalToPay: "Total a pagar",
      scanWithApp: "Escanea este código con tu aplicación de pago",

      // Estados
      loading: "Cargando menú...",
      loadError: "Error al cargar los datos.",
      errorTitle: "Error al cargar",
      retry: "Reintentar",
      noProducts: "No hay productos disponibles en esta categoría",
    },
  },
  en: {
    translation: {
      // Navbar
      home: "Home",
      menu: "Menu",
      about: "About",
      contact: "Contact",
      logout: "Logout",

      // Menu
      menuDescription: "Lunch dishes",
      deliciousProduct: "Delicious product",
      addToCart: "Add to Cart",
      yourCart: "Your Cart",
      emptyCart: "Your cart is empty",
      total: "Total",
      remove: "Remove",
      proceedPayment: "Proceed to Payment",

      // QR
      scanToPay: "Scan to Pay",
      qrCode: "Payment QR Code",
      totalToPay: "Total to pay",
      scanWithApp: "Scan this code with your payment app",

      // States
      loading: "Loading menu...",
      loadError: "Error loading data.",
      errorTitle: "Loading Error",
      retry: "Retry",
      noProducts: "No products available in this category",
    },
  },
  ay: {
    translation: {
      // Navbar
      home: "Qallta",
      menu: "Manq'aña",
      about: "Nayankiri",
      contact: "Yatiyaña",
      logout: "Mistuña",

      // Menú
      menuDescription: "Chika uru manq'añataki",
      deliciousProduct: "Suma manq'a",
      addToCart: "Chhijllaña uñacht'ayaña",
      yourCart: "Jumana chhijlla",
      emptyCart: "Jumana chhijllaxa ch'usawa",
      total: "Taqi",
      remove: "Apsuña",
      proceedPayment: "Qullqi churañataki saraña",

      // QR
      scanToPay: "Qullqi churañataki uñjaña",
      qrCode: "Qullqi churañataki QR chimpuxa",
      totalToPay: "Qullqi churañaxa",
      scanWithApp: "Aka chimpu uñjaña qullqi churañataki wakichata",

      // Estados
      loading: "Manq'añanaka apanipxiwa...",
      loadError: "Pantjasiwa datos apanañana.",
      errorTitle: "Pantjata apañana",
      retry: "Wasitata yant'aña",
      noProducts: "Janiwa manq'añanakax utjkiti aka categoriana",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // Idioma inicial
  fallbackLng: "es", // Idioma de respaldo
  interpolation: {
    escapeValue: false, // React ya hace escape
  },
  debug: false, // Cambiar a true para ver logs de i18next
});

export default i18n;
