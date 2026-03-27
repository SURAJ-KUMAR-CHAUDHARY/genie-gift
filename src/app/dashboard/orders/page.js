"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Sparkles } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from API — for now show empty state since user hasn't placed any orders yet
    setLoading(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-dim transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-headline font-extrabold text-2xl tracking-tight text-on-surface flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          My Orders
        </h1>
        <div className="w-10"></div>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <Sparkles className="w-16 h-16 text-outline-variant mb-6" />
          <h2 className="text-xl font-headline font-bold mb-2">No orders yet</h2>
          <p className="text-on-surface-variant mb-8">Once you place an order, it will appear here.</p>
          <Link href="/discover" className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-primary/90 transition-colors">
            Find a Gift
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 editorial-shadow">
              <div>
                <p className="font-bold text-on-surface">Order #{order.id?.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-3 sm:mt-0 text-left sm:text-right">
                <p className="font-bold text-primary">₹{order.totalAmount}</p>
                <span className="inline-block px-2 py-1 bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold uppercase tracking-wider rounded">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
