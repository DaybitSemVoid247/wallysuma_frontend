import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      // Navbar
      home: 'Inicio',
      menu: 'Menú',
      about: 'Nosotros',
      contact: 'Contacto',
      logout: 'Salir',
      menuDescription: 'Platos para el almuerzo',
      deliciousProduct: 'Delicioso producto',
      addToCart: 'Agregar al Carrito',
      yourCart: 'Tu Carrito',
      emptyCart: 'Tu carrito está vacío',
      total: 'Total',
      remove: 'Eliminar',
      proceedPayment: 'Proceder al Pago',
      scanToPay: 'Escanea para Pagar',
      qrCode: 'Código QR de pago',
      totalToPay: 'Total a pagar',
      scanWithApp: 'Escanea este código con tu aplicación de pago',
      loading: 'Cargando menú...',
      loadError: 'Error al cargar los datos.',
      errorTitle: 'Error al cargar',
      retry: 'Reintentar',
      noProducts: 'No hay productos disponibles en esta categoría'
    }
  },
  en: {
    translation: {
      home: 'Home',
      menu: 'Menu',
      about: 'About',
      contact: 'Contact',
      logout: 'Logout',
      menuDescription: 'Lunch dishes',
      deliciousProduct: 'Delicious product',
      addToCart: 'Add to Cart',
      yourCart: 'Your Cart',
      emptyCart: 'Your cart is empty',
      total: 'Total',
      remove: 'Remove',
      proceedPayment: 'Proceed to Payment',
      scanToPay: 'Scan to Pay',
      qrCode: 'Payment QR Code',
      totalToPay: 'Total to pay',
      scanWithApp: 'Scan this code with your payment app',
      loading: 'Loading menu...',
      loadError: 'Error loading data.',
      errorTitle: 'Loading Error',
      retry: 'Retry',
      noProducts: 'No products available in this category'
    }
  },
  fr: {
    translation: {
      home: 'Accueil',
      menu: 'Menu',
      about: 'À propos',
      contact: 'Contact',
      logout: 'Déconnexion',
      menuDescription: 'Plats pour le déjeuner',
      deliciousProduct: 'Produit délicieux',
      addToCart: 'Ajouter au panier',
      yourCart: 'Votre Panier',
      emptyCart: 'Votre panier est vide',
      total: 'Total',
      remove: 'Supprimer',
      proceedPayment: 'Procéder au paiement',
      scanToPay: 'Scanner pour payer',
      qrCode: 'QR Code de paiement',
      totalToPay: 'Total à payer',
      scanWithApp: 'Scannez avec votre application',
      loading: 'Chargement...',
      loadError: 'Erreur de chargement.',
      errorTitle: 'Erreur',
      retry: 'Réessayer',
      noProducts: 'Aucun produit disponible'
    }
  },
  it: {
    translation: {
      home: 'Home',
      menu: 'Menu',
      about: 'Chi siamo',
      contact: 'Contatto',
      logout: 'Esci',
      menuDescription: 'Piatti per pranzo',
      deliciousProduct: 'Prodotto delizioso',
      addToCart: 'Aggiungi al carrello',
      yourCart: 'Il Tuo Carrello',
      emptyCart: 'Il carrello è vuoto',
      total: 'Totale',
      remove: 'Rimuovi',
      proceedPayment: 'Procedi al pagamento',
      scanToPay: 'Scansiona per pagare',
      qrCode: 'Codice QR',
      totalToPay: 'Totale da pagare',
      scanWithApp: 'Scansiona con la tua app',
      loading: 'Caricamento...',
      loadError: 'Errore di caricamento.',
      errorTitle: 'Errore',
      retry: 'Riprova',
      noProducts: 'Nessun prodotto disponibile'
    }
  },
  de: {
    translation: {
      home: 'Startseite',
      menu: 'Menü',
      about: 'Über uns',
      contact: 'Kontakt',
      logout: 'Abmelden',
      menuDescription: 'Mittagsgerichte',
      deliciousProduct: 'Köstliches Produkt',
      addToCart: 'In den Warenkorb',
      yourCart: 'Ihr Warenkorb',
      emptyCart: 'Warenkorb ist leer',
      total: 'Gesamt',
      remove: 'Entfernen',
      proceedPayment: 'Zur Kasse',
      scanToPay: 'Scannen zum Bezahlen',
      qrCode: 'QR-Code',
      totalToPay: 'Zu zahlen',
      scanWithApp: 'Mit Ihrer App scannen',
      loading: 'Laden...',
      loadError: 'Fehler beim Laden.',
      errorTitle: 'Fehler',
      retry: 'Wiederholen',
      noProducts: 'Keine Produkte verfügbar'
    }
  },
  pt: {
    translation: {
      home: 'Início',
      menu: 'Cardápio',
      about: 'Sobre',
      contact: 'Contato',
      logout: 'Sair',
      menuDescription: 'Pratos para o almoço',
      deliciousProduct: 'Produto delicioso',
      addToCart: 'Adicionar ao carrinho',
      yourCart: 'Seu Carrinho',
      emptyCart: 'Carrinho vazio',
      total: 'Total',
      remove: 'Remover',
      proceedPayment: 'Finalizar compra',
      scanToPay: 'Escanear para pagar',
      qrCode: 'Código QR',
      totalToPay: 'Total a pagar',
      scanWithApp: 'Escaneie com seu app',
      loading: 'Carregando...',
      loadError: 'Erro ao carregar.',
      errorTitle: 'Erro',
      retry: 'Tentar novamente',
      noProducts: 'Sem produtos disponíveis'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;