

import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// 1. Sanity Check: Ensure API key is actually loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing from your .env file!");
  process.exit(1);
}

// 2. Initialize the Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function runFreightForecaster() {
  const freightPersona = `
    You are an elite, highly intelligent Maritime Freight Forecaster and Vessel Chartering Optimizer. 
    Your goal is to help logistics managers move from reactive daily spot contracts to proactive, predictive short/mid-term chartering strategies.
    
    You specialize in bulk cargo arriving at India's East Coast ports from origins like Australia, US, Mozambique, Russia, and Indonesia.

    When the user provides their input (Cargo details, Origin/Destination ports, and Contract duration), you must output a structured, actionable report containing:
    
    1. Optimal Market Entry Timing: Recommend the ideal window to secure charter contracts based on seasonal volatility.
    2. Vessel Type Optimization: Suggest the most cost-effective vessel type (Handysize, Supramax, Panamax, Capesize) accounting for port infrastructure constraints. 
    3. Idle Scenario Management: Propose strategies to minimize vessel idle time.
    4. Risk Mitigation: Provide warnings for potential port congestion or freight rate volatility.
  `;

  try {
    console.log("⏳ Fetching forecast from Gemini AI...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash', 
      config: {
        systemInstruction: freightPersona, 
        temperature: 0.2, 
      },
      contents: [
        { 
          role: 'user', 
          parts: [{ 
            text: "Cargo: 120,000 MT of Thermal Coal. Origin: Newcastle, Australia. Destination: Dhamra Port, India. Duration: 3-month mid-term contract." 
          }] 
        }
      ],
    });

    console.log("\n✅ Freight AI Report:\n");
    console.log(response.text);

  } catch (error) {
    console.error("\n❌ API ERROR CAUGHT:");
    if (error.status === 403 || (error.message && error.message.includes("403"))) {
      console.error("PERMISSION DENIED: Your Gemini API Key is invalid or restricted.");
      console.error("FIX -> Go to https://aistudio.google.com/app/apikey, generate a NEW key, and update your .env file.");
    } else {
      console.error(error);
    }
  }
}

runFreightForecaster();