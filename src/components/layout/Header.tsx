"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  MapPin,
  Phone,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

const navigation = [
  { name: "Shop All", href: "/products" },
  {
    name: "Plants",
    href: "/products?category=plants",
    submenu: [
      { name: "Tropical", href: "/products?category=tropical" },
      { name: "Succulents", href: "/products?category=succulent" },
      { name: "Cacti", href: "/products?category=cacti" },
      { name: "Air Plants", href: "/products?category=air-plants" },
      { name: "Rare & Unusual", href: "/products?category=rare" },
      { name: "Pet Safe", href: "/products?petSafe=true" },
    ],
  },
  {
    name: "Accessories",
    href: "/products?category=accessories",
    submenu: [
      { name: "Pots & Planters", href: "/products?category=pots" },
      { name: "Soil & Amendments", href: "/products?category=soil" },
      { name: "Tools", href: "/products?category=tools" },
    ],
  },
  { name: "Bundles", href: "/products?category=bundles" },
  { name: "Plant Care", href: "/care-guides" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((state) => state.itemCount);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sage-200">
      {/* Top bar */}
      <div className="bg-sage-800 text-white py-2">
        <div className="container-custom flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a
              href="tel:+12085551234"
              className="flex items-center gap-1.5 hover:text-sage-200 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">(208) 555-1234</span>
            </a>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Boise, Idaho</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sage-200">
              Free local pickup available!
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-sage-600 hover:text-sage-900"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl text-sage-800 tracking-tight">
                Greenscapes
              </span>
              <span className="text-xs md:text-sm text-sage-500 tracking-widest uppercase -mt-1">
                Boutique
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="nav-link py-2 inline-flex items-center"
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-lg shadow-lg border border-sage-200 py-2 min-w-[180px]">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block px-4 py-2 text-sage-600 hover:bg-sage-50 hover:text-sage-900 transition-colors"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <button
              type="button"
              className="p-2 text-sage-600 hover:text-sage-900 transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 text-sage-600 hover:text-sage-900 transition-colors relative"
            >
              <Heart className="h-5 w-5 md:h-6 md:w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-terracotta-500 text-white text-xs font-medium rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-sage-600 hover:text-sage-900 transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-sage-600 text-white text-xs font-medium rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-sage-950/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-sage-200">
              <span className="font-serif text-xl text-sage-800">Menu</span>
              <button
                type="button"
                className="p-2 text-sage-600 hover:text-sage-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4">
              {navigation.map((item) => (
                <div key={item.name} className="py-2">
                  <Link
                    href={item.href}
                    className="block text-lg text-sage-800 font-medium hover:text-sage-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="mt-2 ml-4 space-y-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block text-sage-600 hover:text-sage-800"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-sage-950/50"
            onClick={() => setSearchOpen(false)}
          />
          <div className="fixed top-0 inset-x-0 bg-white shadow-lg p-4 md:p-6">
            <div className="container-custom">
              <div className="flex items-center gap-4">
                <Search className="h-6 w-6 text-sage-400" />
                <input
                  type="text"
                  placeholder="Search plants, pots, and more..."
                  className="flex-1 text-lg md:text-xl text-sage-900 placeholder:text-sage-400 bg-transparent focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  className="p-2 text-sage-600 hover:text-sage-900"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
