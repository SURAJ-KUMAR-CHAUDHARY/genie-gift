# Step 4: Core AI Engine (Gemini API)

This is the core value proposition of GiftGenie AI. You will set up an API route that takes user input, queries the Google Gemini API, and maps the results to products.

## 1. AI Helper Function
Create a helper script `src/lib/ai.js` to abstract the Gemini API calls:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateGiftSuggestions({ description, occasion, budget, relationship, emotions }) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    You are GiftGenie, an expert gift curator. 
    A user is looking for a gift with these details:
    - Person Description: ${description}
    - Relationship: ${relationship}
    - Occasion: ${occasion}
    - Maximum Budget (₹): ${budget}
    - Associated Emotions: ${emotions}

    Generate:
    1. Top 5 gift suggestions (name, why it's perfect, estimated price, category).
    2. A heartfelt personalized message (2-3 sentences) to include with the gift.
    3. 2 combo bundle ideas (3 items each) that stay within the budget.
    4. Delivery timing advice for the occasion.

    Respond STRICTLY in the following JSON format without Markdown formatting:
    {
      "suggestions": [
        { "name": "...", "reason": "...", "price": 0, "category": "..." }
      ],
      "message": "...",
      "comboBundles": [
        { "bundleName": "...", "items": ["..."], "totalPrice": 0 }
      ],
      "deliveryTip": "..."
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean markdown JSON wrapping if present
  const cleanedText = text.replace(/```json\n?|\`\`\`/g, '');
  
  return JSON.parse(cleanedText);
}
```

## 2. API Route for Suggestions
Create the main endpoint `src/app/api/ai/suggest/route.js`:

```javascript
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
```

This route will be called from your frontend `discover.html` equivalent when the user clicks "Find the Perfect Gift".
