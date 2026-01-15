'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'es' | 'fr' | 'it' | 'de';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', es: 'Inicio', fr: 'Accueil', it: 'Home', de: 'Startseite' },
  'nav.shop': { en: 'Shop', es: 'Tienda', fr: 'Boutique', it: 'Negozio', de: 'Shop' },
  'nav.about': { en: 'About', es: 'Acerca de', fr: 'À propos', it: 'Chi siamo', de: 'Über uns' },
  'nav.contact': { en: 'Contact', es: 'Contacto', fr: 'Contact', it: 'Contatti', de: 'Kontakt' },
  'nav.signIn': { en: 'Sign In', es: 'Iniciar sesión', fr: 'Se connecter', it: 'Accedi', de: 'Anmelden' },
  'nav.signOut': { en: 'Sign Out', es: 'Cerrar sesión', fr: 'Se déconnecter', it: 'Esci', de: 'Abmelden' },
  'nav.myOrders': { en: 'My Orders', es: 'Mis pedidos', fr: 'Mes commandes', it: 'I miei ordini', de: 'Meine Bestellungen' },
  'nav.adminDashboard': { en: 'Admin Dashboard', es: 'Panel de administración', fr: 'Tableau de bord', it: 'Dashboard Admin', de: 'Admin-Dashboard' },

  // Hero
  'hero.title': { en: 'Premium Olive Oils', es: 'Aceites de Oliva Premium', fr: 'Huiles d\'Olive Premium', it: 'Oli d\'Oliva Premium', de: 'Premium Olivenöle' },
  'hero.subtitle': { en: 'From our groves to your table', es: 'De nuestros olivares a tu mesa', fr: 'De nos oliveraies à votre table', it: 'Dai nostri oliveti alla tua tavola', de: 'Von unseren Hainen zu Ihrem Tisch' },
  'hero.cta': { en: 'Shop Now', es: 'Comprar ahora', fr: 'Acheter maintenant', it: 'Acquista ora', de: 'Jetzt kaufen' },
  'hero.tagline': { en: 'Premium Quality Since 1952', es: 'Calidad Premium Desde 1952', fr: 'Qualité Premium Depuis 1952', it: 'Qualità Premium Dal 1952', de: 'Premium Qualität Seit 1952' },
  'hero.heading1': { en: 'Pure. Natural.', es: 'Puro. Natural.', fr: 'Pur. Naturel.', it: 'Puro. Naturale.', de: 'Rein. Natürlich.' },
  'hero.heading2': { en: 'Exceptional.', es: 'Excepcional.', fr: 'Exceptionnel.', it: 'Eccezionale.', de: 'Außergewöhnlich.' },
  'hero.description': { en: 'Experience the finest extra virgin olive oils, cold-pressed from hand-picked olives in our Mediterranean groves.', es: 'Experimenta los mejores aceites de oliva virgen extra, prensados en frío de aceitunas recogidas a mano en nuestros olivares mediterráneos.', fr: 'Découvrez les meilleures huiles d\'olive extra vierges, pressées à froid à partir d\'olives cueillies à la main dans nos oliveraies méditerranéennes.', it: 'Scopri i migliori oli extravergine d\'oliva, spremuti a freddo da olive raccolte a mano nei nostri oliveti mediterranei.', de: 'Erleben Sie die feinsten nativen Olivenöle extra, kaltgepresst aus handverlesenen Oliven in unseren mediterranen Hainen.' },
  'hero.shopCollection': { en: 'Shop Collection', es: 'Ver Colección', fr: 'Voir la Collection', it: 'Vedi Collezione', de: 'Kollektion Ansehen' },
  'hero.ourStory': { en: 'Our Story', es: 'Nuestra Historia', fr: 'Notre Histoire', it: 'La Nostra Storia', de: 'Unsere Geschichte' },
  'hero.awardWinning': { en: 'Award Winning', es: 'Premiado', fr: 'Primé', it: 'Premiato', de: 'Preisgekrönt' },
  'hero.freeShipping': { en: 'Free Shipping $50+', es: 'Envío Gratis +$50', fr: 'Livraison Gratuite +50$', it: 'Spedizione Gratuita +50$', de: 'Kostenloser Versand ab 50$' },
  'hero.satisfaction': { en: '100% Satisfaction', es: '100% Satisfacción', fr: '100% Satisfaction', it: '100% Soddisfazione', de: '100% Zufriedenheit' },

  // Products
  'product.addToCart': { en: 'Add to Cart', es: 'Añadir al carrito', fr: 'Ajouter au panier', it: 'Aggiungi al carrello', de: 'In den Warenkorb' },
  'product.outOfStock': { en: 'Out of Stock', es: 'Agotado', fr: 'Rupture de stock', it: 'Esaurito', de: 'Nicht vorrätig' },
  'product.featured': { en: 'Featured', es: 'Destacado', fr: 'En vedette', it: 'In evidenza', de: 'Empfohlen' },
  'product.reviews': { en: 'reviews', es: 'reseñas', fr: 'avis', it: 'recensioni', de: 'Bewertungen' },

  // Cart
  'cart.title': { en: 'Shopping Cart', es: 'Carrito de compras', fr: 'Panier', it: 'Carrello', de: 'Warenkorb' },
  'cart.empty': { en: 'Your cart is empty', es: 'Tu carrito está vacío', fr: 'Votre panier est vide', it: 'Il tuo carrello è vuoto', de: 'Ihr Warenkorb ist leer' },
  'cart.subtotal': { en: 'Subtotal', es: 'Subtotal', fr: 'Sous-total', it: 'Subtotale', de: 'Zwischensumme' },
  'cart.checkout': { en: 'Checkout', es: 'Pagar', fr: 'Passer à la caisse', it: 'Checkout', de: 'Zur Kasse' },
  'cart.continueShopping': { en: 'Continue Shopping', es: 'Seguir comprando', fr: 'Continuer les achats', it: 'Continua a fare acquisti', de: 'Weiter einkaufen' },

  // Checkout
  'checkout.shipping': { en: 'Shipping Information', es: 'Información de envío', fr: 'Informations de livraison', it: 'Informazioni di spedizione', de: 'Lieferinformationen' },
  'checkout.payment': { en: 'Payment Details', es: 'Detalles de pago', fr: 'Détails de paiement', it: 'Dettagli di pagamento', de: 'Zahlungsdetails' },
  'checkout.orderConfirmed': { en: 'Order Confirmed!', es: '¡Pedido confirmado!', fr: 'Commande confirmée!', it: 'Ordine confermato!', de: 'Bestellung bestätigt!' },
  'checkout.thankYou': { en: 'Thank you for your order', es: 'Gracias por tu pedido', fr: 'Merci pour votre commande', it: 'Grazie per il tuo ordine', de: 'Vielen Dank für Ihre Bestellung' },

  // Common
  'common.search': { en: 'Search', es: 'Buscar', fr: 'Rechercher', it: 'Cerca', de: 'Suchen' },
  'common.save': { en: 'Save', es: 'Guardar', fr: 'Enregistrer', it: 'Salva', de: 'Speichern' },
  'common.cancel': { en: 'Cancel', es: 'Cancelar', fr: 'Annuler', it: 'Annulla', de: 'Abbrechen' },
  'common.loading': { en: 'Loading...', es: 'Cargando...', fr: 'Chargement...', it: 'Caricamento...', de: 'Wird geladen...' },
  'common.error': { en: 'Error', es: 'Error', fr: 'Erreur', it: 'Errore', de: 'Fehler' },

  // Orders
  'orders.title': { en: 'My Orders', es: 'Mis Pedidos', fr: 'Mes Commandes', it: 'I Miei Ordini', de: 'Meine Bestellungen' },
  'orders.noOrders': { en: 'No orders yet', es: 'Aún no hay pedidos', fr: 'Pas encore de commandes', it: 'Nessun ordine ancora', de: 'Noch keine Bestellungen' },
  'orders.status.pending': { en: 'Pending', es: 'Pendiente', fr: 'En attente', it: 'In attesa', de: 'Ausstehend' },
  'orders.status.processing': { en: 'Processing', es: 'Procesando', fr: 'En cours', it: 'In elaborazione', de: 'In Bearbeitung' },
  'orders.status.shipped': { en: 'Shipped', es: 'Enviado', fr: 'Expédié', it: 'Spedito', de: 'Versendet' },
  'orders.status.completed': { en: 'Completed', es: 'Completado', fr: 'Terminé', it: 'Completato', de: 'Abgeschlossen' },
  'orders.status.cancelled': { en: 'Cancelled', es: 'Cancelado', fr: 'Annulé', it: 'Annullato', de: 'Storniert' },
};

const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  languages: { code: Language; name: string }[];
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Persist to localStorage
    localStorage.setItem('oliveoil-language', lang);
  }, []);

  // Load saved language on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('oliveoil-language') as Language;
    if (saved && Object.keys(languageNames).includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const translation = translations[key];
    if (translation) {
      return translation[language] || translation.en || fallback || key;
    }
    return fallback || key;
  }, [language]);

  const languages = Object.entries(languageNames).map(([code, name]) => ({
    code: code as Language,
    name,
  }));

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
