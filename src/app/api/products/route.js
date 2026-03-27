import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image || "/images/default-product.jpg",
        category: data.category || "Gift",
        tags: data.tags || "AI-suggested",
        rating: data.rating || 4.5,
        inStock: data.inStock !== false
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
