import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET cart items with product details
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true }
  });

  return NextResponse.json(cartItems);
}

// POST item to cart
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { productId, quantity, isCombo, comboName } = await req.json();

  // Check if product exists first
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  // Check if item already exists in cart, then update quantity or create new
  const existingItem = await prisma.cartItem.findFirst({
    where: { userId: session.user.id, productId }
  });

  if (existingItem) {
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
    return NextResponse.json(updated);
  }

  const newItem = await prisma.cartItem.create({
    data: {
      userId: session.user.id,
      productId,
      quantity,
      isCombo: isCombo || false,
      comboName
    }
  });

  return NextResponse.json(newItem, { status: 201 });
}

// PATCH update item quantity
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id, quantity } = await req.json();

  const updatedItem = await prisma.cartItem.update({
    where: { id, userId: session.user.id },
    data: { quantity }
  });

  return NextResponse.json(updatedItem);
}

// DELETE item from cart
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  await prisma.cartItem.delete({
    where: { id, userId: session.user.id }
  });

  return NextResponse.json({ message: "Item removed from cart" });
}
