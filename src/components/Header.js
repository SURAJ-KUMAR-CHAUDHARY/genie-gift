"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Menu, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count on mount
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const cartItems = await res.json();
          setCartCount(cartItems.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#ffffff]/70 backdrop-blur-3xl border-b border-[#ccc3d8]/30">
      <div className="flex items-center justify-between px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <Link href="/" className="flex items-center gap-2 font-headline font-extrabold text-xl text-primary tracking-tight">
          <Sparkles className="w-5 h-5 text-primary" />
          GiftGenie AI
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="relative text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95">
            <Heart className="w-6 h-6" />
          </Link>
          <Link href="/cart" className="relative text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
