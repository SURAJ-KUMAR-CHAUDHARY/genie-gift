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