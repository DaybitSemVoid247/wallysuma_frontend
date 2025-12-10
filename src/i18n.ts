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

      // ⭐ NUEVO: Login/Registro
      loginTitle: "INICIAR SESIÓN",
      registerTitle: "REGISTRO DE USUARIOS",
      email: "Correo Electrónico",
      password: "Contraseña",
      confirmPassword: "Confirme Contraseña",
      firstName: "Nombre",
      lastName: "Apellido Paterno",
      motherLastName: "Apellido Materno",
      loginButton: "ENTRAR",
      registerButton: "REGISTRARSE",
      loadingButton: "CARGANDO...",
      registeringButton: "Registrando...",
      dontHaveAccount: "¿No tienes cuenta?",
      alreadyHaveAccount: "¿Ya tienes cuenta?",
      registerHere: "Regístrate aquí",
      loginHere: "Inicia sesión aquí",

      // Validaciones
      errorOnlyLetters: "El campo {{field}} solo puede contener letras",
      errorMinPassword: "La contraseña debe tener al menos 6 caracteres",
      errorPasswordMismatch: "Las contraseñas no coinciden",
      errorServerConnection: "Error al conectar con el servidor",

      // Verificación de correo
      emailVerificationTitle: "Verificación de Correo",
      emailVerificationMessage: "Ingresa el código de 6 dígitos enviado a:",
      verificationCodePlaceholder: "Código de verificación",
      verifyCodeButton: "Verificar Código",
      cancelButton: "Cancelar",
      errorEnterCode: "Debes ingresar un código",
      errorVerifyingCode: "Error al verificar el código",

      // Modal de éxito
      accountVerifiedTitle: "¡Cuenta Verificada!",
      accountVerifiedMessage: "Tu cuenta ha sido verificada correctamente.",
      nowCanLogin: "Ahora puedes iniciar sesión",
      acceptButton: "Aceptar",
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

      // ⭐ NEW: Login/Register
      loginTitle: "LOGIN",
      registerTitle: "USER REGISTRATION",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      motherLastName: "Mother's Last Name",
      loginButton: "LOGIN",
      registerButton: "REGISTER",
      loadingButton: "LOADING...",
      registeringButton: "Registering...",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      registerHere: "Register here",
      loginHere: "Login here",

      // Validations
      errorOnlyLetters: "The {{field}} field can only contain letters",
      errorMinPassword: "Password must be at least 6 characters",
      errorPasswordMismatch: "Passwords do not match",
      errorServerConnection: "Error connecting to server",

      // Email verification
      emailVerificationTitle: "Email Verification",
      emailVerificationMessage: "Enter the 6-digit code sent to:",
      verificationCodePlaceholder: "Verification code",
      verifyCodeButton: "Verify Code",
      cancelButton: "Cancel",
      errorEnterCode: "You must enter a code",
      errorVerifyingCode: "Error verifying code",

      // Success modal
      accountVerifiedTitle: "Account Verified!",
      accountVerifiedMessage: "Your account has been verified successfully.",
      nowCanLogin: "You can now log in",
      acceptButton: "Accept",
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

      // ⭐ MACHAQ: Mantaña/Qillqantaña
      loginTitle: "MANTAÑA",
      registerTitle: "MAQI QILLQANTAÑA",
      email: "Correo electrónico taqi",
      password: "Jist'araña aru",
      confirmPassword: "Jist'araña aru taypita",
      firstName: "Suti",
      lastName: "Awkipa sutipa",
      motherLastName: "Taykapa sutipa",
      loginButton: "MANTAÑA",
      registerButton: "QILLQANTASIÑA",
      loadingButton: "APANIPXIWA...",
      registeringButton: "Qillqanipxiwa...",
      dontHaveAccount: "¿Janiwa qillqatatati?",
      alreadyHaveAccount: "¿Qillqatatati?",
      registerHere: "Akana qillqantasiñamawa",
      loginHere: "Akana mantañamawa",

      // Validaciones
      errorOnlyLetters: "Aka {{field}} ukaxa qillqanakakiwa",
      errorMinPassword: "Jist'araña aruxa 6 qillqanipuniwa",
      errorPasswordMismatch: "Jist'araña arunakax janiw kipkakiti",
      errorServerConnection: "Pantjasiwa servidor ukar mantañana",

      // Verificación de correo
      emailVerificationTitle: "Correo taypita uñjasaña",
      emailVerificationMessage: "6 jakhunaka churta:",
      verificationCodePlaceholder: "Taypita uñjasañataki chimpu",
      verifyCodeButton: "Chimpu uñjasaña",
      cancelButton: "Jikhutaña",
      errorEnterCode: "Chimpu churañamawa",
      errorVerifyingCode: "Pantjasiwa chimpu uñjasañana",

      // Modal de éxito
      accountVerifiedTitle: "¡Qillqata uñjasitawa!",
      accountVerifiedMessage: "Jumana qillqataxa suma uñjasitawa.",
      nowCanLogin: "Jichhax mantañjamawa",
      acceptButton: "Aceptar",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
  debug: false,
});

export default i18n;
