// import express from 'express';
// import cors from 'cors';
// import { GoogleGenAI } from '@google/genai';
// import 'dotenv/config';

// // 1. Sanity Check: Ensure API key is configured
// if (!process.env.GEMINI_API_KEY) {
//   console.warn("⚠️ WARNING: GEMINI_API_KEY is missing from your .env file. Falling back to local intelligence mode.");
// }

// // 2. Initialize the Gemini Client
// const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// }) : null;

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const freightPersona = `
// You are an elite, highly intelligent Maritime Freight Forecaster and Vessel Chartering Optimizer. 
// Your goal is to help logistics managers move from reactive daily spot contracts to proactive, predictive short/mid-term chartering strategies.

// You specialize in bulk cargo arriving at India's East Coast ports from origins like Australia, US, Mozambique, Russia, and Indonesia.

// When the user provides their input (Cargo details, Origin/Destination ports, and Contract duration), you must output a structured, actionable report containing:

// 1. Optimal Market Entry Timing: Recommend the ideal window to secure charter contracts based on seasonal volatility.
// 2. Vessel Type Optimization: Suggest the most cost-effective vessel type (Handysize, Supramax, Panamax, Capesize) accounting for port infrastructure constraints. 
// 3. Idle Scenario Management: Propose strategies to minimize vessel idle time.
// 4. Risk Mitigation: Provide warnings for potential port congestion or freight rate volatility.
// `;

// // Helper: Generates realistic fallback response if API key is invalid or rate limited
// function generateRealisticFallbackForecast({ cargo, origin, destination, duration, vesselType }) {
//   const cargoText = cargo || "120,000 MT of Thermal Coal";
//   const originText = origin || "Newcastle, Australia";
//   const destText = destination || "Dhamra Port, India";
//   const durationText = duration || "3-month mid-term contract";
//   const vesselText = vesselType || "Capesize";

//   return {
//     success: true,
//     isSimulated: true,
//     reportText: `### 🚢 Executive Maritime Chartering Dossier
// **Route**: ${originText} ➔ ${destText}  
// **Cargo**: ${cargoText} | **Horizon**: ${durationText} | **Target Vessel**: ${vesselText}

// ---

// #### 1. ⏱️ Optimal Market Entry Timing
// - **Strategic Window**: Secure contracts between **Week 2 of next month and early Q3**.
// - **Market Dynamics**: Historical Baltic Dry Index (BDI) and Capesize 5TC freight rates indicate a standard 14-18% seasonal dip prior to pre-monsoon restocking.
// - **Contract Recommendation**: Lock in index-linked bunker adjustment factor (BAF) clauses with a 65% forward hedge to isolate spot fuel volatility.

// #### 2. ⚓ Vessel Type Optimization (${vesselText})
// - **Recommended Class**: ${vesselText.toLowerCase().includes('cape') ? 'Capesize (150,000 - 180,000 DWT)' : 'Panamax (75,000 - 82,000 DWT)'}
// - **Draft & Berth Alignment**: Destination (${destText}) provides deep-water capability (up to 18.5m permissible draft at high tide), allowing full laden discharge without offshore transshipment.
// - **Unit Economics**: Saves approximately **$4.20 per metric ton** compared to multi-trip Supramax gearless shipments.

// #### 3. ⏳ Idle Scenario & Demurrage Management
// - **Pre-Berthing Laycan**: Standardize laycan windows to 5-day ranges instead of tight 48-hour spot calls.
// - **Demurrage Protection**: Introduce a reversible laytime clause combining loading at ${originText} with discharge at ${destText} to buffer unexpected port crane maintenance.
// - **Idle Cost Reduction**: Projected idle wait time reduced from 4.2 days down to 1.1 days, conserving an estimated **$38,500/voyage**.

// #### 4. ⚠️ Risk Mitigation & Regional Intelligence
// - **Bay of Bengal Cyclonic Advisory**: East Coast monsoons elevate sea states between May and October; mandate weather-routing corridors south of Sri Lanka.
// - **Berth Queuing**: Expected 2-vessel waiting queue at ${destText}. Pre-clear customs documentation via Port Community System (PCS 1x) prior to pilot boarding.
// `,
//     structured: {
//       optimalTiming: {
//         recommendedWindow: "Next 14-21 Days (Pre-Monsoon Dip)",
//         expectedSavings: "14.8% vs Spot Rate",
//         confidence: "94%"
//       },
//       vesselOptimization: {
//         recommendedClass: vesselText,
//         draftFeasibility: "100% Compatible (Deep Berth Available)",
//         deadweightTonnage: "120k - 175k DWT"
//       },
//       idleManagement: {
//         projectedIdleDays: "1.1 Days",
//         demurrageSavingsEst: "$38,500",
//         laycanBuffer: "5-Day Rolling Window"
//       },
//       riskMitigation: {
//         congestionLevel: "Moderate (1.8 day queue)",
//         monsoonImpact: "Corridor routing advised",
//         rateVolatilityRisk: "Medium-Low"
//       }
//     }
//   };
// }

// // POST endpoint for AI Freight Forecast
// app.post('/api/forecast', async (req, res) => {
//   const { cargo, origin, destination, duration, vesselType } = req.body;

//   const promptInput = `Cargo: ${cargo || '120,000 MT of Thermal Coal'}. Origin: ${origin || 'Newcastle, Australia'}. Destination: ${destination || 'Dhamra Port, India'}. Duration: ${duration || '3-month mid-term contract'}. Vessel Type: ${vesselType || 'Capesize'}.`;

//   if (!ai) {
//     const fallback = generateRealisticFallbackForecast({ cargo, origin, destination, duration, vesselType });
//     return res.json(fallback);
//   }

//   try {
//     console.log(`⏳ [Gemini AI] Processing Maritime Forecast for: ${promptInput}`);

//     const response = await ai.models.generateContent({
//       model: 'gemini-flash-latest',
//       config: {
//         systemInstruction: freightPersona,
//         temperature: 0.25,
//       },
//       contents: [
//         {
//           role: 'user',
//           parts: [{ text: promptInput }]
//         }
//       ],
//     });

//     const reportText = response.text || '';
//     console.log("✅ [Gemini AI] Freight forecast generated successfully.");

//     return res.json({
//       success: true,
//       isSimulated: false,
//       reportText: reportText,
//       structured: {
//         optimalTiming: {
//           recommendedWindow: "Within 2-3 Weeks",
//           expectedSavings: "12-18% vs Spot",
//           confidence: "96%"
//         },
//         vesselOptimization: {
//           recommendedClass: vesselType || "Capesize",
//           draftFeasibility: "Approved for Destination Port",
//           deadweightTonnage: "Optimal for Bulk MT"
//         },
//         idleManagement: {
//           projectedIdleDays: "1.2 Days",
//           demurrageSavingsEst: "$32,000",
//           laycanBuffer: "4-5 Day Window"
//         },
//         riskMitigation: {
//           congestionLevel: "Low to Moderate",
//           monsoonImpact: "Seasonal weather routing active",
//           rateVolatilityRisk: "Protected via Mid-term hedge"
//         }
//       }
//     });

//   } catch (error) {
//     console.error("⚠️ Gemini API Call encountered an issue:", error.message);
//     const fallback = generateRealisticFallbackForecast({ cargo, origin, destination, duration, vesselType });
//     return res.json(fallback);
//   }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'online',
//     service: "Maritime Freight Forecaster & Vessel Chartering Optimizer",
//     geminiConfigured: !!process.env.GEMINI_API_KEY
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Maritime Freight Backend Server running on http://localhost:${PORT}`);
// });

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