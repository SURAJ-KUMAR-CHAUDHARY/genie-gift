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