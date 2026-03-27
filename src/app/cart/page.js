"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const router = useRouter();

  // Fetch cart items from API on mount
  useEffect(() => {
    if (session) {
      fetchCartItems();
    }
  }, [session]);

  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const cartItems = await res.json();
        // Map cart items to display format
        const displayItems = cartItems.map(item => ({
          id: item.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          category: item.product.category,
          image: item.product.image
        }));
        setItems(displayItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const checkoutData = await res.json();
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      }
    } catch (e) {
      console.error(e);
      alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQuantity })
      });
      
      if (res.ok) {
        setItems(items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      
      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32 min-h-screen">
      <header className="mb-10 flex items-center justify-between">
        <Link href="/discover" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-dim transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface">
          Your Cart
        </h1>
        <div className="w-10"></div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <ShoppingBag className="w-16 h-16 text-outline-variant mb-6" />
          <h2 className="text-xl font-headline font-bold mb-2">Cart is empty</h2>
          <p className="text-on-surface-variant mb-8">Ready to find some magical gifts?</p>
          <Link href="/discover" className="px-8 py-3 bg-primary text-white font-bold rounded-full">
            Start Discovering
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-5 bg-surface-container-lowest rounded-2xl editorial-shadow border border-outline-variant/10">
                <div className="w-full sm:w-32 h-32 bg-surface-container-high rounded-xl flex items-center justify-center overflow-hidden">
                   {/* Placeholder image representation */}
                   <ShoppingBag className="w-8 h-8 text-on-surface-variant opacity-50" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-on-surface">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-on-surface-variant hover:text-error transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-on-surface-variant">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end mt-4 sm:mt-0">
                    <p className="font-bold text-primary text-lg">₹{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 bg-surface-container-high px-3 py-1 rounded-full">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-on-surface-variant font-bold px-2 hover:text-primary transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-on-surface-variant font-bold px-2 hover:text-primary transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl h-fit sticky top-24 border border-outline-variant/20 editorial-shadow">
            <h3 className="font-bold text-xl mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm text-on-surface-variant mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-on-surface">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-primary font-bold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-bold text-on-surface">₹{(subtotal * 0.18).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold font-headline text-2xl text-primary">₹{(subtotal * 1.18).toLocaleString()}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold font-headline shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? "Processing..." : "Proceed to Checkout"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
            {!session && (
              <p className="text-xs text-center text-on-surface-variant mt-4">
                You will be redirected to log in first.
              </p>
            )}
            
            <div className="mt-6 p-4 rounded-xl bg-primary-fixed/30 border border-primary-fixed flex gap-3 text-sm">
              <Sparkles className="w-6 h-6 text-primary shrink-0" />
              <p className="text-on-primary-fixed-variant">All gifts are elegantly packaged and include your personalized AI-generated handwritten note.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
