import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing from your .env file!");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

const freightPersona = `
    You are an elite, highly intelligent Maritime Freight Forecaster and Vessel Chartering Optimizer. 
    Your goal is to help logistics managers move from reactive daily spot contracts to proactive, predictive short/mid-term chartering strategies.
    
    You specialize in bulk cargo arriving at India's East Coast ports from origins like Australia, US, Mozambique, Russia, and Indonesia.

    When the user provides their input (Cargo details, Origin/Destination ports, and Contract duration), you must output a structured, actionable report containing:
    
    1. Optimal Market Entry Timing: Recommend the ideal window to secure charter contracts based on seasonal volatility.
    2. Vessel Type Optimization: Suggest the most cost-effective vessel type accounting for port infrastructure constraints. 
    3. Idle Scenario Management: Propose strategies to minimize vessel idle time.
    4. Risk Mitigation: Provide warnings for potential port congestion or freight rate volatility.
`;

app.post('/api/forecast', async (req, res) => {
  try {
    console.log("⏳ Catching request from frontend...");
    
    // Extract the live data sent from your React dashboard
    const { loadingPort, dischargePort, vesselClass, charterStructure, commodity, portClearance } = req.body;

    // Build the dynamic prompt using the frontend parameters
    const dynamicPrompt = `Cargo: ${commodity}. Origin: ${loadingPort}. Destination: ${dischargePort}. Vessel: ${vesselClass}. Port Clearance: ${portClearance}. Duration: ${charterStructure}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash', // Updated to the latest stable model version
      config: {
        systemInstruction: freightPersona, 
        temperature: 0.2, 
      },
      contents: [
        { 
          role: 'user', 
          parts: [{ text: dynamicPrompt }] 
        }
      ],
    });

    console.log("✅ Report generated and sent to frontend.");
    
    // Send the generated text back to populate the glass panel
    res.json({ report: response.text });

  } catch (error) {
    console.error("\n❌ API ERROR CAUGHT:");
    if (error.status === 403 || (error.message && error.message.includes("403"))) {
      console.error("PERMISSION DENIED: Your Gemini API Key is invalid or restricted.");
    } else {
      console.error(error);
    }
    res.status(500).json({ 
      report: "Analysis failed. Please verify your backend terminal for errors." 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Voyage Forecast API listening on http://localhost:${PORT}`);
});