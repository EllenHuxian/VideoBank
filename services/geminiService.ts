import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTagsAndDescription = async (base64Image: string): Promise<{ tags: string[], description: string }> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "You are an AI assisting a VideoBank worker. Analyze this video frame. Provide a JSON object with two fields: 'tags' (an array of 5-8 relevant, specific keywords describing the activity, tools, or environment) and 'description' (a concise 1-sentence summary of the work being done). Focus on technical or skill-based details."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            description: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    return JSON.parse(jsonText) as { tags: string[], description: string };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback if AI fails
    return {
      tags: ['Work', 'Task', 'Manual'],
      description: "Video uploaded by user."
    };
  }
};
