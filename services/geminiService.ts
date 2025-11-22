import { GoogleGenAI, Type } from "@google/genai";
import { ProgramEntry } from "../types";

const apiKey = process.env.API_KEY;

export const generatePrayerSchedule = async (entries: ProgramEntry[]) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert entries to a readable string for the model
  const scheduleData = entries.map((e, index) => 
    `${index + 1}. [${e.type}] by ${e.personName} - Details: ${e.details}`
  ).join('\n');

  const prompt = `
    You are a church service coordinator. 
    Here is the list of items submitted for today's prayer service:
    ${scheduleData}

    Please generate a structured report for me (the leader) to guide the prayer.
    It should include:
    1. An "Opening Speech" welcoming everyone (warm, spiritual).
    2. An "Agenda Summary" listing the flow clearly with transitions.
    3. "Closing Remarks" to end the session.
    
    Keep the tone respectful, encouraging, and organized.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            openingSpeech: { type: Type.STRING },
            agendaSummary: { type: Type.STRING },
            closingRemarks: { type: Type.STRING },
          },
          required: ["openingSpeech", "agendaSummary", "closingRemarks"],
        },
      },
    });

    return response.text; // This will be a JSON string
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const organizeItemsSmartly = async (entries: ProgramEntry[]) => {
    // This function reorders items logically if they are chaotic (e.g. start prayer at end)
    if (!apiKey) return JSON.stringify(entries);

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
        Reorder the following church program items into a logical flow. 
        Rules: 'Start Prayer' should be first. 'End Prayer' should be last. 
        'Songs' often come early or between sessions. 'Sosthra Palli' is usually towards the end but before closing prayer.
        
        Input JSON:
        ${JSON.stringify(entries)}
        
        Return ONLY the JSON array of objects in the correct order.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        return response.text;
    } catch (e) {
        console.error("Failed to reorder", e);
        return JSON.stringify(entries);
    }
}
