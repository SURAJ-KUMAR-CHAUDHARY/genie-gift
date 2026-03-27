import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Get cart items
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true }
  });

  if (cartItems.length === 0) return NextResponse.json({ message: "Cart is empty" }, { status: 400 });

  // Format line items for Stripe
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.product.name,
        images: [item.product.image],
        description: item.product.description,
      },
      unit_amount: item.product.price * 100, // Stripe expects cents
    },
    quantity: item.quantity,
  }));

  // Create checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    client_reference_id: session.user.id,
  });

  return NextResponse.json({ url: stripeSession.url });
}