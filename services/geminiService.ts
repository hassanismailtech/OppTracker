import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Opportunity, AppStatus, UserProfile } from "../types";

// Helper to get today's date for relative deadline parsing
const getToday = () => new Date().toISOString().split('T')[0];

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Job title" },
    company: { type: Type.STRING, description: "Company name" },
    deadline: { type: Type.STRING, description: "Application deadline in YYYY-MM-DD format. If null, return null." },
    scamRiskScore: { type: Type.INTEGER, description: "0-100 probability of being a scam or low quality listing." },
    scamReason: { type: Type.STRING, description: "Reason for the scam risk score." },
    keyCriteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of top 3-5 hard requirements." },
    summary: { type: Type.STRING, description: "Brief 2 sentence summary of the role." }
  },
  required: ["title", "company", "scamRiskScore", "keyCriteria", "summary"],
};

const matchingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fitScore: { type: Type.INTEGER, description: "0-100 score of how well the user fits the job." },
    reasoning: { type: Type.STRING, description: "Short explanation of the fit score." },
  },
  required: ["fitScore", "reasoning"],
};

export const analyzeJobText = async (text: string): Promise<any> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert recruitment vetting agent.
    Analyze the following job description text or message.
    Today is ${getToday()}.
    
    Extract the key details.
    Assess for scam markers (poor grammar, asking for money, unrealistic salary, generic gmail address).
    
    Job Text:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error", error);
    throw error;
  }
};

export const matchProfileToJob = async (user: UserProfile, jobAnalysis: any): Promise<any> => {
  if (!process.env.API_KEY) return { fitScore: 50, reasoning: "API Key missing" };

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Compare the User Profile against the Job Analysis.
    
    User Profile:
    - Experience/CV: ${user.cvText}
    - Interests: ${user.interests.join(", ")}
    
    Job Analysis:
    - Title: ${jobAnalysis.title}
    - Criteria: ${jobAnalysis.keyCriteria?.join(", ")}
    
    Determine a fit score (0-100) and provide a concise reasoning (max 1 sentence).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: matchingSchema,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Matching Error", error);
    return { fitScore: 0, reasoning: "Error calculating fit." };
  }
};

export const createOpportunityFromAnalysis = (
  analysis: any, 
  match: any, 
  originalText: string
): Opportunity => {
  return {
    id: crypto.randomUUID(),
    title: analysis.title || "Unknown Role",
    company: analysis.company || "Unknown Company",
    status: AppStatus.INTERESTED,
    fitScore: match.fitScore || 0,
    fitReasoning: match.reasoning || "No analysis available",
    scamRiskScore: analysis.scamRiskScore || 0,
    deadline: analysis.deadline || null,
    dateAdded: new Date().toISOString(),
    notes: `Extracted from chat. \n\nSummary: ${analysis.summary}`,
    url: originalText.includes('http') ? originalText.match(/\bhttps?:\/\/\S+/gi)?.[0] : undefined
  };
};