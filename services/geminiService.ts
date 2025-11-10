import { GoogleGenAI } from "@google/genai";

// Fix: Per @google/genai guidelines, initialize client directly with `process.env.API_KEY`.
// The API key's presence is a hard requirement and assumed to be configured externally.
// Removed manual checks for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const summarizeNotes = async (notes: string): Promise<string> => {
    if (!notes || notes.trim() === '') {
        return "No notes to summarize.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following vehicle maintenance notes in a few bullet points:\n\n---\n${notes}\n---`,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error summarizing notes with Gemini API:", error);
        return "Could not generate summary due to an API error.";
    }
};