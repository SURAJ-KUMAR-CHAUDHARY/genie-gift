import { NextResponse } from "next/server";
import { generateGiftSuggestions } from "@/lib/ai";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    
    // Generate AI Content
    const aiResponse = await generateGiftSuggestions(payload);

    // Save AI Session to Database
    await prisma.aISession.create({
      data: {
        userId: session.user.id,
        prompt: payload.description,
        occasion: payload.occasion,
        budget: payload.budget,
        relationship: payload.relationship,
        emotions: payload.emotions,
        suggestions: JSON.stringify(aiResponse.suggestions),
        message: aiResponse.message,
        comboBundles: JSON.stringify(aiResponse.comboBundles),
        deliveryTip: aiResponse.deliveryTip
      }
    });

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ message: "Failed to generate suggestions" }, { status: 500 });
  }
}