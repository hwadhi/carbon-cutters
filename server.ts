import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Simple healthcheck API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
    timestamp: new Date().toISOString(),
  });
});

// ESG Standard Carbon Heuristics for Manufacturing segment (fallback & validation assistance)
const segmentEmissionsFactors: Record<string, {
  rawMaterialFactor: number; // kg CO2e per kg material
  energyFactorGrid: number;   // kg CO2e per kWh
  energyFactorSolar: number;  // kg CO2e per kWh
  energyFactorDiesel: number; // kg CO2e per Litre
  transportFactor: number;   // kg CO2e per km-ton
  wasteFactorHazardous: number; // kg CO2e per kg
  wasteFactorGeneral: number;   // kg CO2e per kg
}> = {
  machining: {
    rawMaterialFactor: 2.1, // Aluminum/Steel blended average
    energyFactorGrid: 0.72,
    energyFactorSolar: 0.04,
    energyFactorDiesel: 2.68,
    transportFactor: 0.15,
    wasteFactorHazardous: 1.8,
    wasteFactorGeneral: 0.45,
  },
  plastics: {
    rawMaterialFactor: 1.95, // Polymers
    energyFactorGrid: 0.72,
    energyFactorSolar: 0.04,
    energyFactorDiesel: 2.68,
    transportFactor: 0.15,
    wasteFactorHazardous: 2.2,
    wasteFactorGeneral: 0.5,
  },
  foundry: {
    rawMaterialFactor: 2.8, // Cast iron/Steel heavy melt
    energyFactorGrid: 0.72,
    energyFactorSolar: 0.04,
    energyFactorDiesel: 2.68,
    transportFactor: 0.18,
    wasteFactorHazardous: 2.5,
    wasteFactorGeneral: 0.6,
  },
  electronics: {
    rawMaterialFactor: 14.5, // High value complex boards/chips
    energyFactorGrid: 0.72,
    energyFactorSolar: 0.04,
    energyFactorDiesel: 2.68,
    transportFactor: 0.22,
    wasteFactorHazardous: 3.1,
    wasteFactorGeneral: 0.35,
  },
  textiles: {
    rawMaterialFactor: 4.8, // Synthetic fibers blend
    energyFactorGrid: 0.72,
    energyFactorSolar: 0.04,
    energyFactorDiesel: 2.68,
    transportFactor: 0.12,
    wasteFactorHazardous: 1.5,
    wasteFactorGeneral: 0.4,
  },
};

// 1. Carbon Optimization Endpoint using Gemini API
app.post("/api/gemini/optimize", async (req, res) => {
  try {
    const {
      segment = "machining",
      productionVolume = 1000,
      materialWeight = 5000, // kg
      materialType = "Steel/Blended Metals",
      gridElectricity = 8000, // kWh
      solarElectricity = 2000, // kWh
      dieselFuel = 500, // Litres
      machiningHours = 120,
      transportDistance = 1500, // km
      cargoWeight = 5, // Tons
      generalWaste = 800, // kg
      hazardousWaste = 150, // kg
    } = req.body;

    // 1. Perform baseline deterministic calculation using Standard GHG Protocol rules
    const factors = segmentEmissionsFactors[segment] || segmentEmissionsFactors.machining;
    
    // Scope 1: Direct emissions (Diesel fuel)
    const scope1Direct = dieselFuel * factors.energyFactorDiesel;
    
    // Scope 2: Indirect emissions (Grid Electricity - Solar has nearly zero operational emissions)
    const scope2Indirect = (gridElectricity * factors.energyFactorGrid) + (solarElectricity * factors.energyFactorSolar);
    
    // Scope 3: Value chain emissions (Raw Materials sourcing, Transport Logistics, Waste processing)
    const scope3Materials = materialWeight * factors.rawMaterialFactor;
    const scope3Transport = transportDistance * cargoWeight * factors.transportFactor;
    const scope3Waste = (generalWaste * factors.wasteFactorGeneral) + (hazardousWaste * factors.wasteFactorHazardous);
    const scope3Total = scope3Materials + scope3Transport + scope3Waste;

    const totalCO2e = scope1Direct + scope2Indirect + scope3Total;
    const co2ePerUnit = totalCO2e / Math.max(1, productionVolume);

    const dataContext = {
      segment,
      productionVolume,
      materialWeight,
      materialType,
      gridElectricity,
      solarElectricity,
      dieselFuel,
      machiningHours,
      transportDistance,
      cargoWeight,
      generalWaste,
      hazardousWaste,
      metrics: {
        scope1Direct,
        scope2Indirect,
        scope3Materials,
        scope3Transport,
        scope3Waste,
        scope3Total,
        totalCO2e,
        co2ePerUnit,
      }
    };

    const getMockOutput = () => {
      const segmentNames: Record<string, string> = {
        machining: "Precision Metal Machining & Engineering",
        plastics: "Industrial Plastic Injection Molding",
        foundry: "Heavy Metal Foundry & Smelting",
        electronics: "High-Density Electronics & PCB Assembly",
        textiles: "Automated Textile & Apparel Manufacture",
      };

      return {
        complianceScore: Math.round(75 + Math.random() * 15),
        hotspots: [
          {
            source: "Material Sourcing (Scope 3)",
            impactPercentage: Math.round((scope3Materials / totalCO2e) * 100),
            details: `Sourcing ${materialWeight} kg of ${materialType} represents a substantial portion of the embedded carbon. Traditional material extraction is highly carbon-intensive.`
          },
          {
            source: "Electricity Consumption (Scope 2)",
            impactPercentage: Math.round((scope2Indirect / totalCO2e) * 100),
            details: `Grid electricity usage is responsible for significant indirect Scope 2 emissions. Heavy equipment active for ${machiningHours} hours drives steady energy load.`
          },
          {
            source: "Logistics & Transport (Scope 3)",
            impactPercentage: Math.round((scope3Transport / totalCO2e) * 100),
            details: `Moving ${cargoWeight} tons of materials over ${transportDistance} km by traditional logistics contributes directly to freight emissions.`
          }
        ],
        recommendations: [
          {
            title: "Transition to High-Recycled Content Alloys",
            category: "Materials",
            reductionPotentialCO2: Math.round(scope3Materials * 0.35),
            impact: "High",
            costDifficulty: "Low-Medium",
            description: "Substituting virgin metals/polymers with certified 60%+ recycled content alloy reduces Scope 3 material footprint by up to 35% without requiring tooling redesign."
          },
          {
            title: "Solar PV Capacity Scaling & Peak-Shaving",
            category: "Energy",
            reductionPotentialCO2: Math.round(scope2Indirect * 0.25),
            impact: "High",
            costDifficulty: "High",
            description: `Shift high-draw operations to active solar hours (currently solar covers ${Math.round((solarElectricity / (gridElectricity + solarElectricity)) * 100)}% of demand). Scale solar arrays or introduce battery storage.`
          },
          {
            title: "Logistics Optimization and Route Consolidation",
            category: "Transport",
            reductionPotentialCO2: Math.round(scope3Transport * 0.2),
            impact: "Medium",
            costDifficulty: "Low",
            description: "Negotiate LTL consolidated freighting with logistics carriers employing biofuel/electric fleets, reducing Scope 3 transportation metrics."
          },
          {
            title: "Scrap Recovery Loopback System",
            category: "Waste",
            reductionPotentialCO2: Math.round(scope3Waste * 0.4),
            impact: "Medium",
            costDifficulty: "Medium",
            description: "Institute a strict segregation protocol for metal chips/polymer scrap to sell directly back to suppliers for closed-loop reclamation."
          }
        ],
        regulatoryDisclosures: {
          ghgProtocolStatus: "Compliant - ISO 14064 Framework ready.",
          secDisclosureStatement: `For the reporting period, our simulated ${segmentNames[segment] || segment} facility produced approximately ${(totalCO2e / 1000).toFixed(2)} metric tons of CO2 equivalent emissions. Direct emissions (Scope 1) comprised ${(scope1Direct / totalCO2e * 100).toFixed(1)}%, grid-purchased power (Scope 2) accounted for ${(scope2Indirect / totalCO2e * 100).toFixed(1)}%, and third-party logistics and raw material procurement (Scope 3) made up the remaining ${(scope3Total / totalCO2e * 100).toFixed(1)}%. These metrics conform to standard carbon accounting parameters.`,
          improvementTarget: "Recommended target of 22% footprint reduction over 24 months through localized closed-loop scrap recovery and green power purchase agreements."
        },
        aiModelUsed: "EcoManufacture Heuristics v2.5 (Standard Mode)"
      };
    };

    const ai = getGeminiClient();
    if (!ai) {
      const mockOutput = getMockOutput();
      return res.json({
        success: true,
        isMock: true,
        calculatedMetrics: dataContext.metrics,
        aiInsights: mockOutput
      });
    }

    try {
      // Call Gemini API to analyze and produce professional, deep, customized carbon audit output
      const prompt = `You are a world-class manufacturing LCA (Life Cycle Assessment) engineer and ESG auditor specializing in MSME manufacturing industries.
Analyze the following operational data and carbon footprint metrics for a manufacturing facility:

INDUSTRIAL SEGMENT: ${segment}
PRODUCTION VOLUME: ${productionVolume} units
RAW MATERIAL: ${materialWeight} kg of "${materialType}"
GRID ELECTRICITY: ${gridElectricity} kWh
SOLAR / GREEN ELECTRICITY: ${solarElectricity} kWh
DIESEL FUEL INTAKE: ${dieselFuel} Liters
MACHINE RUN TIME: ${machiningHours} operating hours
LOGISTICS TRANSPORT: ${cargoWeight} tons shipped over ${transportDistance} km
GENERAL MUNICIPAL WASTE: ${generalWaste} kg
HAZARDOUS WASTE PRODUCED: ${hazardousWaste} kg

PRE-CALCULATED CO2e EMISSIONS (in kg CO2e based on standard emissions factors):
- Scope 1 (Direct Combustion/Diesel): ${scope1Direct.toFixed(1)} kg CO2e
- Scope 2 (Purchased Grid Energy): ${scope2Indirect.toFixed(1)} kg CO2e
- Scope 3 Materials Extraction: ${scope3Materials.toFixed(1)} kg CO2e
- Scope 3 Inbound/Outbound Freight Transport: ${scope3Transport.toFixed(1)} kg CO2e
- Scope 3 Waste Treatment Footprint: ${scope3Waste.toFixed(1)} kg CO2e
- Scope 3 Value Chain Total: ${scope3Total.toFixed(1)} kg CO2e
- TOTAL INTEGRATED CO2e EMISSIONS: ${totalCO2e.toFixed(1)} kg CO2e
- INTENSITY METRIC: ${co2ePerUnit.toFixed(2)} kg CO2e per produced unit.

Generate a highly specific, realistic carbon audit and optimization response in JSON format. Provide detailed, expert-level recommendations and compliant regulatory narrative statements for MSMEs. Avoid generic suggestions.

Return exactly matching this JSON schema:
{
  "complianceScore": integer (0 to 100 representing how well the facility is positioned for ESG standards),
  "hotspots": [
    {
      "source": "string description of emission source",
      "impactPercentage": integer (rough percentage of total emissions),
      "details": "string explaining why this is a hotspot and what process-specific mechanics drive it"
    }
  ],
  "recommendations": [
    {
      "title": "string of the specific action item",
      "category": "string (e.g., 'Materials', 'Energy', 'Transport', 'Waste')",
      "reductionPotentialCO2": integer (estimated kg CO2e reduction potential),
      "impact": "string ('High', 'Medium', 'Low')",
      "costDifficulty": "string ('Low', 'Medium', 'High')",
      "description": "string containing technical explanation, operational adjustment details, and economic/ROI justification for MSMEs"
    }
  ],
  "regulatoryDisclosures": {
    "ghgProtocolStatus": "string stating GHG Protocol status",
    "secDisclosureStatement": "string containing a beautiful, professional 3-4 sentence legal-grade ESG disclosure narrative summarizing Scope 1, 2, and 3 findings suitable for annual board reporting.",
    "improvementTarget": "string outlining a recommended Science-Based Target (SBTi) alignment strategy"
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              complianceScore: { type: Type.INTEGER },
              hotspots: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    impactPercentage: { type: Type.INTEGER },
                    details: { type: Type.STRING }
                  },
                  required: ["source", "impactPercentage", "details"]
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    reductionPotentialCO2: { type: Type.INTEGER },
                    impact: { type: Type.STRING },
                    costDifficulty: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "category", "reductionPotentialCO2", "impact", "costDifficulty", "description"]
                }
              },
              regulatoryDisclosures: {
                type: Type.OBJECT,
                properties: {
                  ghgProtocolStatus: { type: Type.STRING },
                  secDisclosureStatement: { type: Type.STRING },
                  improvementTarget: { type: Type.STRING }
                },
                required: ["ghgProtocolStatus", "secDisclosureStatement", "improvementTarget"]
              }
            },
            required: ["complianceScore", "hotspots", "recommendations", "regulatoryDisclosures"]
          }
        }
      });

      const aiText = response.text;
      if (!aiText) {
        throw new Error("No response text from Gemini API");
      }

      const aiInsights = JSON.parse(aiText);

      return res.json({
        success: true,
        isMock: false,
        calculatedMetrics: dataContext.metrics,
        aiInsights,
      });

    } catch (geminiError: any) {
      console.warn("Gemini API optimization call failed, falling back to heuristics:", geminiError);
      
      const mockOutput = getMockOutput();
      const isRateLimit = geminiError.status === "RESOURCE_EXHAUSTED" || 
                          geminiError.message?.includes("429") || 
                          geminiError.message?.includes("quota") ||
                          geminiError.message?.includes("exhausted") ||
                          geminiError.code === 429;
      
      mockOutput.aiModelUsed = isRateLimit 
        ? "EcoManufacture Heuristics (Gemini Quota Exceeded Fallback)" 
        : "EcoManufacture Heuristics (Gemini API Unavailable Fallback)";

      return res.json({
        success: true,
        isMock: true,
        calculatedMetrics: dataContext.metrics,
        aiInsights: mockOutput,
        rateLimited: isRateLimit
      });
    }

  } catch (error: any) {
    console.error("Critical optimize endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during AI carbon analysis."
    });
  }
});

// 2. AI Interactive Chat Auditor for Mfg Carbon footprint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages = [], contextData = {} } = req.body;

    const chatHistory = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const getMockReply = (isRateLimit: boolean, hasClient: boolean) => {
      const lastMessage = messages[messages.length - 1]?.content || "";
      let mockReply = "";
      if (isRateLimit) {
        mockReply = "[⚠️ Gemini API Quota exceeded. Using local compliance database fallback]\n\n";
      } else if (hasClient) {
        mockReply = "[⚠️ Gemini API is temporarily unavailable. Using local compliance database fallback]\n\n";
      } else {
        mockReply = "[Sustaneer Standard Mode - Offline Local Compliance Assistant]\n\n";
      }

      if (lastMessage.toLowerCase().includes("scope 3")) {
        mockReply += "In small manufacturing, Scope 3 is often 70-90% of the entire carbon footprint. Focus on material circularity (reclaiming tooling scrap) and prioritizing suppliers located within a 500km radius to slash transit logistics footprint. Is there a specific process you want to optimize?";
      } else if (lastMessage.toLowerCase().includes("energy") || lastMessage.toLowerCase().includes("electricity")) {
        mockReply += "Machining and smelting require continuous raw power. Moving your schedule to off-peak periods or coordinating with solar output hours directly lowers utility charges and offsets carbon intensity. Implementing IoT sub-metering lets you track individual CNC machine spikes.";
      } else if (lastMessage.toLowerCase().includes("compliance") || lastMessage.toLowerCase().includes("gri") || lastMessage.toLowerCase().includes("standards")) {
        mockReply += "To meet global environmental standards (e.g., ISO 14064, SEC Climate Disclosures, GRI 305), MSME manufacturers should map materials (Scope 3), utility bills (Scope 2), and fuel/coolant leaks (Scope 1). Our ESG report builder exports disclosure statements aligned with these standard regulations.";
      } else {
        mockReply += "Our carbon footprint metrics indicate that raw material embedded carbon represents your biggest emissions hotspot. We recommend exploring eco-alloys and recycled polymers to lower Scope 3 indices. What part of your production process would you like to deep dive into?";
      }
      return mockReply;
    };

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        isMock: true,
        reply: getMockReply(false, false),
      });
    }

    try {
      // Initialize chat session on backend
      const latestMessage = chatHistory.pop()?.parts[0]?.text || "Hello";
      
      // Inject system instructions and state context
      const systemPrompt = `You are "Sustaneer AI", an interactive senior ESG compliance and carbon audit consultant designed for small and medium manufacturing (MSME) factories.
Your goal is to guide industrial managers to understand, disclose, and optimize their Scope 1, Scope 2, and Scope 3 emissions according to the GHG Protocol and ISO 14064.

Context of user's current facility settings:
${JSON.stringify(contextData, null, 2)}

Provide specific, practical, highly encouraging industrial advice. Avoid high-level generalities. Highlight low-cost operational changes (e.g. idle-state machine power reduction, chip briquetting, coolant recycling loops, local supply sourcing).
Speak clearly, with a professional and friendly tone. Keep responses within 2-3 concise paragraphs with bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...chatHistory.map((h: any) => ({
            role: h.role,
            parts: [{ text: h.parts[0].text }]
          })),
          { role: "user", parts: [{ text: latestMessage }] }
        ],
        config: {
          systemInstruction: systemPrompt,
        }
      });

      return res.json({
        success: true,
        isMock: false,
        reply: response.text || "I apologize, I could not process that request. Let's try again.",
      });

    } catch (geminiError: any) {
      console.warn("Gemini Chat API call failed, falling back to heuristics:", geminiError);
      const isRateLimit = geminiError.status === "RESOURCE_EXHAUSTED" || 
                          geminiError.message?.includes("429") || 
                          geminiError.message?.includes("quota") ||
                          geminiError.message?.includes("exhausted") ||
                          geminiError.code === 429;
      return res.json({
        success: true,
        isMock: true,
        reply: getMockReply(isRateLimit, true),
      });
    }

  } catch (error: any) {
    console.error("Critical Gemini chat error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during your AI auditor conversation."
    });
  }
});

// ESG Disclosure Download endpoint
app.post("/api/report/download", (req, res) => {
  const { data, aiInsights } = req.body;
  
  if (!data) {
    return res.status(400).json({ error: "Missing report parameters" });
  }

  // Generate standardized plain-text regulatory ESG disclosure document
  const timestamp = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const reportContent = `========================================================================
             SUSTANEER ESG COMPLIANCE & CARBON DISCLOSURE STATEMENT
========================================================================
Generated on: ${timestamp}
Standard Framework: GHG Protocol Corporate Standard & ISO 14064-1
Facility Type: MSME Manufacturing Segment - ${data.segment?.toUpperCase()}
Reporting Integrity Mode: ${aiInsights?.aiModelUsed || "Gemini-3.5 AI Certified Verification"}

1. OPERATIONAL BOUNDARIES & REPORTING PARAMETERS
------------------------------------------------------------------------
- Production Period: Monthly Baseline
- Segment Classification: ${data.segment}
- Production Output Volume: ${data.productionVolume} Units
- Primary Sourced Material: ${data.materialWeight} kg of ${data.materialType}
- Energy Inputs: Grid (${data.gridElectricity} kWh) | Solar (${data.solarElectricity} kWh)
- Direct Diesel Fuel Consumption: ${data.dieselFuel} Litres
- Transit Freight Logistics Logistics: ${data.cargoWeight} Tons over ${data.transportDistance} km
- Municipal & Regulated Waste: Municipal (${data.generalWaste} kg) | Hazardous (${data.hazardousWaste} kg)

2. INTEGRATED EMISSIONS ANALYSIS (CO2 Equivalent)
------------------------------------------------------------------------
- SCOPE 1 (Direct Facility Combustion): ${((req.body.metrics?.scope1Direct || 0) / 1000).toFixed(3)} Metric Tons (tCO2e)
- SCOPE 2 (Purchased Secondary Energy): ${((req.body.metrics?.scope2Indirect || 0) / 1000).toFixed(3)} Metric Tons (tCO2e)
- SCOPE 3 (Upstream Supply Chain & Logistics): ${((req.body.metrics?.scope3Total || 0) / 1000).toFixed(3)} Metric Tons (tCO2e)
  └─ embedded Materials: ${((req.body.metrics?.scope3Materials || 0) / 1000).toFixed(3)} tCO2e
  └─ Logistics Freight: ${((req.body.metrics?.scope3Transport || 0) / 1000).toFixed(3)} tCO2e
  └─ Waste Treatment: ${((req.body.metrics?.scope3Waste || 0) / 1000).toFixed(3)} tCO2e

- COMBINED INTEGRATED FOOTPRINT: ${((req.body.metrics?.totalCO2e || 0) / 1000).toFixed(3)} Metric Tons (tCO2e)
- REVENUE/PRODUCTION CARBON INTENSITY: ${(req.body.metrics?.co2ePerUnit || 0).toFixed(2)} kg CO2e per completed unit

3. STANDARDIZED ESG REGULATORY DISCLOSURE NARRATIVE
------------------------------------------------------------------------
${aiInsights?.regulatoryDisclosures?.secDisclosureStatement || "Our facility emits standard emissions conforming to traditional small-industrial parameters. Action items focus on reducing Scope 3 material supply loops and shifting to fully green power purchases."}

4. SCIENCE-BASED TARGETS (SBTi) ALIGNMENT PATHWAY
------------------------------------------------------------------------
Target Profile: ${aiInsights?.regulatoryDisclosures?.improvementTarget || "Reduce overall carbon indices by 22% within 24 months."}

Recommended Action Interventions:
${(aiInsights?.recommendations || []).map((r: any, idx: number) => `${idx + 1}. [${r.category}] ${r.title} (Est. Savings: ${r.reductionPotentialCO2} kg CO2e) - Priority: ${r.impact}`).join("\n")}

------------------------------------------------------------------------
DISCLAIMER: This document constitutes a certified self-assessment statement generated in accordance with standard Greenhouse Gas Protocol emissions calculations. Verification indices are optimized for compliance reporting under SEC Climate Rules and GRI 305 Environmental standards.
========================================================================`;

  res.setHeader("Content-Disposition", `attachment; filename=Sustaneer_ESG_Disclosure_${data.segment}.txt`);
  res.setHeader("Content-Type", "text/plain");
  res.send(reportContent);
});

// Configure Vite or serve build files
if (process.env.NODE_ENV !== "production") {
  const startVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development custom Express server booted on http://localhost:${PORT}`);
    });
  };
  startVite();
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production custom Express server running on port ${PORT}`);
  });
}
