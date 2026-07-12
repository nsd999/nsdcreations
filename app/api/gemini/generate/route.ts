import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, agentType } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return a robust, detailed simulated response tailored to the agent type when GEMINI_API_KEY is not configured.
      // This satisfies the user's requirement to have graceful "Not Configured" states.
      let simulationText = "";
      if (agentType === "brand") {
        simulationText = `### 🌟 BRAND ARCHITECTURE (SIMULATION MODE)
**Status**: Gemini API Not Configured. Showing high-fidelity simulated response.

**Brand Concept**: *${prompt}*

#### 1. Cinematic Brand Slogan
> "Where imagination meets intelligence, we engineer reality."

#### 2. Visual Identity & Brand Palette
* **Cosmic Charcoal** (\`#0a0a0a\`) - Representing depth, sophistication, and foundational stability.
* **Cinematic Silver** (\`#e4e4e7\`) - Premium clarity, elegant layouts, and modern typography.
* **Hyper-Neon Indigo** (\`#6366f1\`) - Representing the intelligent pulse of automation.

#### 3. Core Brand Narrative
For *${prompt}*, we design an experience that feels comparable to Stripe, Vercel, and Linear. It establishes authority through a minimal, high-contrast visual design, balanced negative space, and premium micro-interactions.

#### 4. Go-To-Market Slogan ideas
* *Uncompromised execution for visionary brands.*
* *The intersection of code, cinematography, and cognitive automation.*

*To unlock real, dynamic AI generations using Gemini, please add your **GEMINI_API_KEY** in the Settings Secrets panel.*`;
      } else if (agentType === "cinematic") {
        simulationText = `### 🎬 CINEMATIC SCRIPT TREATMENT (SIMULATION MODE)
**Status**: Gemini API Not Configured. Showing high-fidelity simulated response.

**Creative Prompt**: *${prompt}*

#### 1. Visual Mood & Direction
* **Vibe**: Dark, cinematic, high contrast, neo-noir, soft ambient glows.
* **Aspect Ratio**: 16:9 Ultra-widescreen cinematic layout.
* **Pacing**: Staggered, slow-burn reveals with high-frequency micro-cuts.

#### 2. Scene Breakdown & Narrative
* **Scene 01 (0:00 - 0:05)**: A macro lens shots of code compiled on a high-refresh-rate screen. The light casts a deep violet glow over a dark minimalist workspace.
* **Scene 02 (0:05 - 0:12)**: Transitions to a sleek automated server cluster. Cooling fans rotate slowly in a quiet vacuum, blinking blue indicators pulsating in rhythm.
* **Scene 03 (0:12 - 0:20)**: Final title card fades in. Elegant display typography overlays an ethereal gradient: *NSD Creations — Crafting the Infinite*.

#### 3. Sound Design
Deep bass hum (30Hz), organic mechanical clicks, fading into a sweeping analog synthesizer chord representing an intelligent awakening.

*To unlock real, dynamic AI generations using Gemini, please add your **GEMINI_API_KEY** in the Settings Secrets panel.*`;
      } else {
        simulationText = `### ⚙️ SYSTEM ARCHITECTURE & AUTOMATION (SIMULATION MODE)
**Status**: Gemini API Not Configured. Showing high-fidelity simulated response.

**System Spec**: *${prompt}*

#### 1. Microservice Topology
* **Edge Routing Gateway**: Custom Next.js 15 routing with route-level middleware caching.
* **Automation Core**: Serverless edge handlers proxying to isolated task queues.
* **State Engine**: Relational Cloud SQL using Drizzle ORM paired with Redis for low-latency session persistence.

#### 2. Data Flow Architecture
1. **Request Intake**: Client issues high-concurrency requests through isolated HTTPS channels.
2. **Task Queueing**: Tasks are ingested, serialized, and scheduled asynchronously using a priority matrix.
3. **AI Logic Processing**: Background workers orchestrate LLM execution and metadata extraction.

#### 3. Sample Database Schema (Prisma/Drizzle)
\`\`\`typescript
export const systemMetrics = pgTable("system_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  specName: text("spec_name").notNull(),
  latencyMs: integer("latency_ms").default(0),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow()
});
\`\`\`

*To unlock real, dynamic AI generations using Gemini, please add your **GEMINI_API_KEY** in the Settings Secrets panel.*`;
      }

      return NextResponse.json({
        text: simulationText,
        isConfigured: false,
      });
    }

    // Initialize real GoogleGenAI client since API key is configured
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let systemInstruction = "You are the Lead Creative Director and Principal AI Engineer at NSD Creations. Always output high-quality, professional, beautifully formatted Markdown with rich structure, headings, bold text, bullet points, and code blocks where appropriate.";
    if (agentType === "brand") {
      systemInstruction += " Focus on generating full brand profiles, core visual palettes (hex codes), design typography recommendations, slogans, and marketing copy.";
    } else if (agentType === "cinematic") {
      systemInstruction += " Focus on generating highly detailed cinematic scene treatments, script boards, sensory mood descriptions, lighting guidelines, and custom audio cues.";
    } else {
      systemInstruction += " Focus on software architecture, clean code snippets, PostgreSQL/Drizzle schema definitions, database structures, and systems engineering blueprints.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      },
    });

    return NextResponse.json({
      text: response.text || "No content was generated.",
      isConfigured: true,
    });
  } catch (error: any) {
    console.error("Gemini API Route Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred during content generation.",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
