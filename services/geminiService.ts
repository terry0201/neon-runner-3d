import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateGameCoaching = async (score: number, deathReason: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Good run! Keep trying to beat your high score.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I just played a 3D endless runner game. I scored ${score} points. I died because: ${deathReason}. 
      Give me a very short, witty, sarcastic, or motivational comment (max 20 words) as a "Game Master AI".`,
    });
    return response.text || "Mission failed. Retry initiated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection lost... but your spirit remains!";
  }
};
