import { NextResponse } from "next/server";
import sharp from "sharp";

// Temporary, allowlisted migration endpoint used only to move Evolution Lab's
// original poster artwork into this repository. Remove after assets are copied.
const ASSETS: Record<string, string> = {
  "summer-camp": "https://nsdportfolio.lovable.app/assets/poster-summer-camp-W7EXsf_w.jpg",
  "morning-rituals": "https://nsdportfolio.lovable.app/assets/poster-morning-rituals-DFT_e2T0.png",
  "handwriting-mastery": "https://nsdportfolio.lovable.app/assets/poster-handwriting-mastery-krse_OyI.png",
  "360-wellness": "https://nsdportfolio.lovable.app/assets/poster-360-wellness-BusWpKKP.png",
  "keerthys-daycare": "https://nsdportfolio.lovable.app/assets/poster-keerthys-daycare-9fDDUZ1T.png",
  "phonics": "https://nsdportfolio.lovable.app/assets/poster-phonics-jACPHxD3.png",
  "painting-course": "https://nsdportfolio.lovable.app/assets/poster-painting-course-os2sPpi4.png",
  "nsd-creations": "https://nsdportfolio.lovable.app/assets/poster-nsd-creations-CfopbehW.png",
  "summer-camp-fun": "https://nsdportfolio.lovable.app/assets/poster-summer-camp-fun-Bb0fZjCy.png",
  "learning-creativity": "https://nsdportfolio.lovable.app/assets/poster-learning-creativity-N9WyGCAY.png",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ asset: string }> },
) {
  const { asset } = await context.params;
  const sourceUrl = ASSETS[asset];
  if (!sourceUrl) {
    return NextResponse.json({ error: "Unknown asset" }, { status: 404 });
  }

  try {
    const upstream = await fetch(sourceUrl, { cache: "force-cache" });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream asset unavailable", status: upstream.status },
        { status: 502 },
      );
    }

    const original = Buffer.from(await upstream.arrayBuffer());
    const optimized = await sharp(original)
      .rotate()
      .resize({ width: 1400, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toBuffer();

    return NextResponse.json({
      asset,
      contentType: "image/webp",
      base64: optimized.toString("base64"),
      bytes: optimized.length,
    });
  } catch {
    return NextResponse.json({ error: "Could not export asset" }, { status: 502 });
  }
}
