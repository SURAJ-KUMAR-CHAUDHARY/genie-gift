"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gift, Heart, ShoppingBag, Sparkles, MessageCircleHeart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("giftResults");
    if (data) {
      try {
        setResults(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse", e);
      }
    }
  }, []);

  const handleAddToCart = async (item, type = "single") => {
    try {
      // For now, we'll create a temporary product if it doesn't exist
      // In a real app, the AI suggestions would include product IDs
      let productId = null;
      
      if (type === "single") {
        // Try to find existing product by name
        const response = await fetch("/api/products");
        const products = await response.json();
        const found = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        
        if (found) {
          productId = found.id;
        } else {
          // Create a temporary product if not found
          const createResponse = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: item.name,
              description: item.reason || `${item.name} - AI suggested gift`,
              price: item.price,
              image: "/images/default-product.jpg",
              category: item.category || "Gift",
              tags: "AI-suggested, gift",
              rating: 4.5,
              inStock: true
            })
          });
          
          if (createResponse.ok) {
            const newProduct = await createResponse.json();
            productId = newProduct.id;
          } else {
            throw new Error("Could not create product");
          }
        }
      }

      const payload = {
        productId: productId || item.id,
        quantity: 1,
        isCombo: type === "bundle",
        comboName: type === "bundle" ? item.bundleName : undefined
      };

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`Added ${type === "single" ? item.name : item.bundleName} to cart!`);
      } else {
        const error = await response.json();
        if (response.status === 401) {
          alert("Please login to add to cart.");
          router.push("/login");
        } else {
          alert(`Error: ${error.message || "Failed to add to cart"}`);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Please login to add to cart.");
      router.push("/login");
    }
  };

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <Sparkles className="w-16 h-16 text-primary mb-6 opacity-50" />
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">No suggestions found</h2>
        <p className="text-on-surface-variant mb-8">We need some details to work our magic.</p>
        <Link href="/discover" className="py-3 px-8 bg-primary text-white rounded-full font-bold shadow-lg">
          Try the Genie
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-32">
      <header className="py-8 flex items-center justify-between">
        <Link href="/discover" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-dim transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          The Perfect Matches
        </h1>
        <div className="w-10"></div> {/* spacer */}
      </header>

      <section className="space-y-8">
        {/* Curated Message from AI */}
        <div className="glass-card rounded-2xl p-6 border border-white/60 editorial-shadow relative overflow-hidden bg-gradient-to-br from-primary-fixed to-surface-container-highest">
          <MessageCircleHeart className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-bold text-on-surface mb-2">Suggested Note</h3>
          <p className="italic text-on-surface-variant">"{results.message}"</p>
        </div>

        {/* Individual Suggestions */}
        <div>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
            <Gift className="w-5 h-5 text-secondary" />
            Top Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.suggestions?.map((item, idx) => (
              <div key={idx} className="bg-surface-container-lowest rounded-xl p-5 editorial-shadow border border-outline-variant/10 flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-on-surface leading-tight pr-4">{item.name}</h3>
                    <span className="text-primary font-bold bg-primary-container/20 px-2 py-1 rounded text-sm whitespace-nowrap">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-surface-container-high text-on-surface-variant mb-3">
                    {item.category}
                  </div>
                  <p className="text-sm text-on-surface-variant mb-6">{item.reason}</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
                  <button 
                    onClick={() => handleAddToCart(item, "single")}
                    className="flex-1 py-2.5 bg-primary text-white rounded-full font-bold text-sm shadow-md hover:bg-primary/90 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant hover:text-error transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combo Bundles */}
        {results.comboBundles?.length > 0 && (
          <div className="pt-8">
            <h2 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-tertiary" />
              Signature Bundles
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {results.comboBundles.map((bundle, idx) => (
                <div key={idx} className="bg-gradient-to-br from-surface to-surface-container flex flex-col md:flex-row gap-6 p-6 rounded-2xl editorial-shadow border border-outline-variant/30">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-on-surface mb-2">{bundle.bundleName}</h3>
                    <ul className="space-y-2 mb-4">
                      {bundle.items.map((item, idy) => (
                        <li key={idy} className="flex items-start gap-2 text-sm text-on-surface-variant">
                          <span className="text-primary mt-0.5">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-end md:w-48 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/20">
                    <div className="text-sm font-medium text-on-surface-variant mb-1">Bundle Total</div>
                    <div className="text-2xl font-bold text-primary mb-4">₹{bundle.totalPrice.toLocaleString()}</div>
                    <button 
                      onClick={() => handleAddToCart(bundle, "bundle")}
                      className="w-full py-2.5 bg-on-surface text-surface rounded-full font-bold text-sm shadow-md hover:bg-on-surface/90 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add Bundle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
