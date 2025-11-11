import { GoogleGenAI } from "@google/genai";

export const summarizeNotes = async (notes: string): Promise<string> => {
    if (!notes || notes.trim() === '') {
        return "No notes to summarize.";
    }
    try {
        // Initialize client here to prevent app crash on load if API_KEY is missing.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following vehicle maintenance notes in a few bullet points:\n\n---\n${notes}\n---`,
        });
        return response.text;
    } catch (error) {
        console.error("Error with Gemini API:", error);
        if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API key is missing"))) {
             return "Could not generate summary. The API key is not configured or is invalid.";
        }
        if (typeof ReferenceError !== 'undefined' && error instanceof ReferenceError && error.message.includes("process is not defined")) {
             return "Could not generate summary. The application is not configured for API access.";
        }
        return "Could not generate summary due to an API error.";
    }
};