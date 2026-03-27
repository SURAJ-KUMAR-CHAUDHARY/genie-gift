"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MessageCircle, Bot, Gift, Quote, Share2, Globe } from "lucide-react";

// Component for Add to Cart functionality
function AddToCartButton({ productName, price }) {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      // First, get the products to find the correct ID
      const productsRes = await fetch("/api/products");
      if (!productsRes.ok) {
        throw new Error("Failed to fetch products");
      }
      
      const products = await productsRes.json();
      
      // Find the product by name
      const product = products.find(p => p.name === productName);
      
      if (!product) {
        alert("Product not found. Please try again later.");
        return;
      }

      // Add to cart
      const cartRes = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          isCombo: false
        })
      });

      if (cartRes.ok) {
        alert(`${productName} added to cart!`);
      } else {
        const error = await cartRes.json();
        if (cartRes.status === 401) {
          alert("Please log in to add items to cart.");
        } else {
          alert(`Error: ${error.message || "Failed to add to cart"}`);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Please log in to add items to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={adding}
      className="px-4 py-1.5 rounded-full bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-colors disabled:opacity-50"
    >
      {adding ? "Adding..." : "Add to cart"}
    </button>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative px-6 py-12 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-container-low via-surface to-surface-container-lowest"></div>
        {/* Decorative sparkle elements */}
        <div className="absolute top-10 right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-[-10%] w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="max-w-md mx-auto text-center space-y-8 mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm font-medium">
            <span className="material-symbols-outlined text-sm" data-icon="magic_button">magic_button</span>
            The future of gifting is here
          </div>

          <h1 className="font-headline font-extrabold text-[2.75rem] leading-[1.1] text-on-background tracking-tight">
            STOP SEARCHING.<br />
            <span className="text-primary">START DESCRIBING.</span>
          </h1>

          <p className="text-on-surface-variant text-lg leading-relaxed px-2">
            Tell us about the person, their emotions, and the occasion — our AI finds the perfect gift.
          </p>

          <div className="flex flex-col gap-4 items-center">
            <Link href="/discover" className="group w-full py-5 px-8 rounded-full bg-primary-container text-on-primary font-semibold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all no-underline">
              Find the Perfect Gift
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Glassmorphism Hero Graphic */}
        <div className="relative mt-12 px-4 max-w-md mx-auto">
          <div className="glass-card rounded-xl p-6 border border-white/40 editorial-shadow">
            <img
              alt="Luxury gift box"
              className="w-full h-48 object-cover rounded-xl mb-4"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPAo8BCNTqT1aqQmPw8xrgKIlvXFgGdnYm4oxVm3El6aF1KlVvdqL7OE22lortZREi4rrYWFwYzKVs0YNrzLyl87RW_OHZqMQNGIWSovr4nJBJ9BuxdRFe1uJNW1GGk8eBm11iNfnnLzm20jHcGEYUZe-WbKMd6W9wUacdNd4kK3tYCEfDwUGwNvpZT8fD84otBcMeZ6Knnhp1dP6glzpqPApuJumqcpXYuoz2sTXxVikV5XUQRqQi3ZMLTatV6TjfC3lvQY1elnM"
            />
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-medium text-primary">AI RECOMMENDED</p>
                <p className="font-bold text-on-surface">Ethereal Silk Scarf</p>
              </div>
              <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                98% Match
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-12 space-y-8 max-w-md mx-auto">
        <div className="space-y-2">
          <h2 className="font-headline font-bold text-2xl text-on-background">How It Works</h2>
          <div className="w-12 h-1 bg-secondary rounded-full"></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6 p-6 bg-surface-container-lowest rounded-lg editorial-shadow">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Step 1: Describe</h3>
              <p className="text-on-surface-variant text-sm">Tell us about the person and occasion</p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 bg-surface-container-lowest rounded-lg editorial-shadow">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Step 2: AI Magic</h3>
              <p className="text-on-surface-variant text-sm">Our AI curates perfect suggestions</p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-6 bg-surface-container-lowest rounded-lg editorial-shadow">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface">Step 3: Gift!</h3>
              <p className="text-on-surface-variant text-sm">Choose, customize, and send</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Gifts */}
      <section className="py-12 bg-surface-container-low">
        <div className="px-6 flex items-center justify-between mb-8 max-w-7xl mx-auto">
          <h2 className="font-headline font-bold text-2xl text-on-background">Trending Gifts 🔥</h2>
          <Link href="/discover" className="text-primary font-semibold text-sm flex items-center gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 px-6 no-scrollbar pb-4 max-w-7xl mx-auto">
          {/* Product 1 */}
          <div className="flex-shrink-0 w-64 bg-surface-container-lowest rounded-lg overflow-hidden editorial-shadow group relative">
            <img alt="Minimalist Watch" className="w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq9spR5-Inuou4rwRpxCs5jOQ1Q-j2XXtABr05w7G4eB8qSTwtPCof_QI21bXydt5QzeGvs6cUO_e7gN98RGmXYEpm1C2-tEEc34wmZQjc0g_nytfc2RMy_MucEtqoPhG6sH7VSmT_8kIY_4G92ZdYfZIaxXbDD7Ic36Wx9gOnJKJdMBdg5aLmLIaZPTe7KPSMP4r_vInU9rY0CoNPBD-WXtWB0zBoMP9k4iNTkZreHhY_3O0LX2kR8Po9wdOlCxKs9mJ2NGWvg_0" />
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-on-surface truncate">The Horizon Watch</h3>
              <p className="text-on-surface-variant text-xs line-clamp-2">Timeless design for someone who values precision and style.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-primary font-bold text-lg">₹1,299</span>
                <AddToCartButton productId="prod_1" productName="The Horizon Watch" price={1299} />
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex-shrink-0 w-64 bg-surface-container-lowest rounded-lg overflow-hidden editorial-shadow group relative">
            <img alt="Artisanal Candle" className="w-full h-48 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDQN8g-WXLhvtEuRYwP-XwDP2cBklik3UMoD5FG5QwJD-QQN4k-tIqcA4aUqJyM7eNjZlNtBykfI22h9Mo3-hKjFIYXiLXY7HHtPXV9T-6tAmiqKcXCUvkFyX9QudeVPUsociR0yxsU6RGM7Jh0W_3jMUwbWJ0JMXV70djdMjSTIXyyveaCxymqlfVSChLeYeuE8lde2bPfhKaYm_G-lO_JI_SRJOgZItTZCKuVSnuwqemjYHLo7ntsc1Eb_FdSdmUxMJAZgGtKDk" />
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-on-surface truncate">Zen Ceramic Candle</h3>
              <p className="text-on-surface-variant text-xs line-clamp-2">Hand-poured soy wax with notes of sandalwood and sea salt.</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-primary font-bold text-lg">₹849</span>
                <AddToCartButton productId="prod_2" productName="Zen Ceramic Candle" price={849} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotion Categories */}
      <section className="px-6 py-12 max-w-md mx-auto">
        <h2 className="font-headline font-bold text-2xl text-on-background mb-8">Shop by Emotion ❤️</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/discover" className="bg-[#ffe8e8] text-[#a13333] px-4 py-5 rounded-lg flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform">
            <span className="text-2xl">❤️</span>
            <span className="font-bold">Love</span>
          </Link>
          <Link href="/discover" className="bg-[#fff7e0] text-[#855300] px-4 py-5 rounded-lg flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform">
            <span className="text-2xl">🎉</span>
            <span className="font-bold">Joy</span>
          </Link>
          <Link href="/discover" className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-5 rounded-lg flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform">
            <span className="text-2xl">🙏</span>
            <span className="font-bold">Gratitude</span>
          </Link>
          <Link href="/discover" className="bg-[#ede7f6] text-[#512da8] px-4 py-5 rounded-lg flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform">
            <span className="text-2xl">😮</span>
            <span className="font-bold">Surprise</span>
          </Link>
        </div>
      </section>

      {/* Testimonial Card */}
      <section className="px-6 py-12 max-w-md mx-auto">
        <div className="glass-card p-8 rounded-xl border border-white/60 editorial-shadow text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-30"></div>
          <Quote className="w-10 h-10 text-primary/40 mx-auto" />
          <p className="text-xl italic font-medium leading-relaxed text-on-surface">
            "The AI picked the perfect anniversary gift for my wife! She loved it."
          </p>
          <div className="flex flex-col items-center gap-2">
            <img alt="Priya S." className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAliZqsOVpBwuFVvS320fQNZBY1ygQ1KGWZU8pm8-OSNN4E-XXlpKAjkBlmf7CodomOKntkt4HOyz9InQborENEfn_v4Op4J3ZiX_nUHuun4zSjeJEBBmgQMJOAtwfYIxqA_ENvdNsk7ZUOdveZXCPqsyK8OqKuUStyQmkMwPq-L4vjQ9bG-PB0ecWGY6-DWfYjyNC7O6ygWnaMfCIKN6azl6vIgTVuvFDtIjgk0rRx03WywS2kBHEH_34mU-0Q5FnA5Z0BjOY1wA" />
            <div className="text-sm font-bold text-on-surface">— Priya S.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-highest px-6 pt-12 pb-8">
        <div className="max-w-md mx-auto space-y-10">
          <Link href="/discover" className="w-full py-5 rounded-full bg-[#1A1A2E] text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
            Shop now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="grid grid-cols-2 gap-y-4 text-sm font-medium">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">About</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Help</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-on-surface/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant/60 font-medium tracking-widest uppercase">
              Copyright © 2026 GiftGenie AI
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
