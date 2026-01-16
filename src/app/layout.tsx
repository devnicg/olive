import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { StoreSettingsProvider } from '@/context/StoreSettingsContext';
import { I18nProvider } from '@/context/I18nContext';
import { ProductProvider } from '@/context/ProductContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Olivia Grove - Premium Olive Oils',
  description: 'Experience the finest extra virgin olive oils, cold-pressed from hand-picked olives in our Mediterranean groves. Since 1952.',
  keywords: ['olive oil', 'extra virgin', 'organic', 'mediterranean', 'premium'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <AuthProvider>
          <I18nProvider>
            <StoreSettingsProvider>
              <CartProvider>
                <FavoritesProvider>
                  <ProductProvider>
                    <Navbar />
                    <CartDrawer />
                    <main>{children}</main>
                    <Footer />
                  </ProductProvider>
                </FavoritesProvider>
              </CartProvider>
            </StoreSettingsProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
