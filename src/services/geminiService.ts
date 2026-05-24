import { GoogleGenAI } from "@google/genai";

// Initialization
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
let conversationHistory: { role: string; content: string }[] = [];

export async function generateGameContent(prompt: string, onUpdate: (text: string) => void) {
  try {
    conversationHistory.push({ role: "user", content: prompt });
    
    const stream = await ai.models.generateContentStream({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are an AI game engine assistant. 
Help the user build a football-chess hybrid game. 
Game mechanics: Grid-based movement (chess-like), football rules (scoring goals on grid).
Current conversation history: ${JSON.stringify(conversationHistory)}.
User input: ${prompt}.
Give concise, actionable tasks, code snippets, or architecture plans.` }]
        }
      ],
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      if (chunk.text) {
        fullResponse += chunk.text;
        onUpdate(fullResponse);
      }
    }
    
    conversationHistory.push({ role: "model", content: fullResponse });
    return fullResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
