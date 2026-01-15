'use client';

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-olive-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-gold-400" />
              <span className="text-2xl font-serif font-bold">Olivia Grove</span>
            </Link>
            <p className="text-olive-300 leading-relaxed">
              Crafting exceptional olive oils from our family groves since 1952.
              Experience the authentic taste of Mediterranean tradition.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-olive-300 hover:text-gold-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-olive-300 hover:text-gold-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-olive-300 hover:text-gold-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-olive-300 hover:text-gold-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Our Products</h3>
            <ul className="space-y-3">
              {['Extra Virgin', 'Infused Oils', 'Organic', 'Gift Sets'].map((item) => (
                <li key={item}>
                  <Link
                    href="/shop"
                    className="text-olive-300 hover:text-gold-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-olive-300">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span>123 Olive Grove Lane<br />Tuscany, Italy 58100</span>
              </li>
              <li className="flex items-center gap-3 text-olive-300">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-olive-300">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span>hello@oliviagrove.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-olive-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-olive-400 text-sm">
            &copy; {new Date().getFullYear()} Olivia Grove. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-olive-400 hover:text-gold-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-olive-400 hover:text-gold-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin" className="text-olive-400 hover:text-gold-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
