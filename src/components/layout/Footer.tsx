import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
} from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

const footerNavigation = {
  shop: [
    { name: "All Plants", href: "/products" },
    { name: "Tropical Plants", href: "/products?category=tropical" },
    { name: "Succulents", href: "/products?category=succulent" },
    { name: "Rare Plants", href: "/products?category=rare" },
    { name: "Pots & Planters", href: "/products?category=pots" },
    { name: "Gift Bundles", href: "/products?category=bundles" },
  ],
  help: [
    { name: "Plant Care Guides", href: "/care-guides" },
    { name: "Shipping & Delivery", href: "/shipping" },
    { name: "Returns Policy", href: "/returns" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Visit Our Store", href: "/visit" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-sage-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-sage-700">
        <div className="container-custom py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl mb-2">
                Join our plant community
              </h3>
              <p className="text-sage-300">
                Get exclusive offers, care tips, and first access to rare plant
                drops delivered to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand & Contact */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl text-white">
                Greenscapes
              </span>
              <span className="block text-xs text-sage-400 tracking-widest uppercase">
                Boutique
              </span>
            </Link>
            <p className="text-sage-300 text-sm mb-6">
              Your green oasis of inspiration in the heart of Boise, Idaho.
            </p>
            <div className="space-y-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sage-300 hover:text-white transition-colors text-sm"
              >
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  123 Garden Way
                  <br />
                  Boise, ID 83702
                </span>
              </a>
              <a
                href="tel:+12085551234"
                className="flex items-center gap-2 text-sage-300 hover:text-white transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>(208) 555-1234</span>
              </a>
              <a
                href="mailto:hello@greenscapesboutique.com"
                className="flex items-center gap-2 text-sage-300 hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>hello@greenscapesboutique.com</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sage-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-2">
              {footerNavigation.help.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sage-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sage-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Hours */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Store Hours
            </h4>
            <ul className="space-y-2 text-sm text-sage-300">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>10am - 7pm</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9am - 6pm</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11am - 5pm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sage-700">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sage-400 text-sm">
            &copy; {new Date().getFullYear()} Greenscapes Boutique. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/greenscapesboutique"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com/greenscapesboutique"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://tiktok.com/@greenscapesboutique"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-400 hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
