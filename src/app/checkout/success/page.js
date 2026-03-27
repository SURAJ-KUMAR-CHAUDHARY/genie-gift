"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Sparkles, Gift, Share2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Check if we have order details in localStorage or URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // In a real app, you would fetch order details from your API
      // For now, we'll use mock data
      setOrderDetails({
        orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        amount: 2999,
        items: [
          { name: "Ethereal Silk Scarf", price: 1299, quantity: 1 },
          { name: "Personalized Engraved Watch", price: 1700, quantity: 1 }
        ],
        estimatedDelivery: "3-5 business days"
      });
    }
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface to-surface-container flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Processing your order...</h1>
          <p className="text-on-surface-variant">Please wait while we confirm your purchase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-surface-container">
      {/* Success Header */}
      <div className="relative py-16 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="font-headline font-extrabold text-4xl text-on-surface mb-4">
            Order Confirmed! ✨
          </h1>
          <p className="text-xl text-on-surface-variant mb-8">
            Your gift is on its way to making someone's day magical.
          </p>
          
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 editorial-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-on-surface-variant">Order ID</span>
              <span className="font-bold text-primary font-headline">{orderDetails.orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Total</span>
              <span className="font-bold text-primary font-headline text-lg">₹{orderDetails.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <section className="py-12 px-6 bg-surface-container">
        <div className="max-w-md mx-auto">
          <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg editorial-shadow border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-high rounded-lg"></div>
                  <div>
                    <h3 className="font-bold text-on-surface">{item.name}</h3>
                    <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-surface-container-lowest rounded-lg">
            <div className="flex justify-between text-sm text-on-surface-variant mb-2">
              <span>Subtotal</span>
              <span>₹{orderDetails.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant mb-2">
              <span>Shipping</span>
              <span className="text-primary font-bold">Free</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant mb-2">
              <span>Tax</span>
              <span>₹{(orderDetails.amount * 0.18).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-outline-variant/30 pt-2">
              <span className="font-bold text-on-surface">Total</span>
              <span className="font-bold text-primary">₹{(orderDetails.amount * 1.18).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-12 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="font-headline font-bold text-xl text-on-surface mb-6">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg editorial-shadow border border-outline-variant/10">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">Email Confirmation</h3>
                <p className="text-sm text-on-surface-variant">Check your inbox for order details and tracking information.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg editorial-shadow border border-outline-variant/10">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">Estimated Delivery</h3>
                <p className="text-sm text-on-surface-variant">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg editorial-shadow border border-outline-variant/10">
              <div className="w-10 h-10 bg-tertiary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Share2 className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">Share the Magic</h3>
                <p className="text-sm text-on-surface-variant">Tell your friends about GiftGenie AI and help them find perfect gifts too!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 bg-surface-container">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Link href="/dashboard" className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-lg px-8 py-4 rounded-full shadow-[0_12px_32px_-8px_rgba(99,14,212,0.4)] hover:brightness-110 active:scale-95 transition-all">
            <Sparkles className="w-6 h-6" />
            View Order History
          </Link>
          
          <div className="pt-6 border-t border-outline-variant/30">
            <p className="text-on-surface-variant text-sm">
              Questions about your order? Contact our support team at{' '}
              <a href="mailto:support@giftgenie.ai" className="text-primary font-bold">support@giftgenie.ai</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}