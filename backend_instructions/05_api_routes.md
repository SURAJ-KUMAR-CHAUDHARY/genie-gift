# Step 5: Core API Routes & Features

Alongside the AI logic, you need CRUD (Create, Read, Update, Delete) routes to support the app's features: Cart, People (Saved Recipients), and Webhooks.

## 1. Saved People API (CRUD)
Create `src/app/api/people/route.js` to manage the user's saved recipients:

```javascript
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET all saved people for current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const people = await prisma.person.findMany({
    where: { userId: session.user.id }
  });

  return NextResponse.json(people);
}

// POST new person
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, relationship, interests, personality } = await req.json();

  const person = await prisma.person.create({
    data: {
      userId: session.user.id,
      name,
      relationship,
      interests,
      personality
    }
  });

  return NextResponse.json(person, { status: 201 });
}
```

## 2. Smart Cart API
Create `src/app/api/cart/route.js` to handle adding products or "combo bundles" to the cart.

```javascript
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
```
