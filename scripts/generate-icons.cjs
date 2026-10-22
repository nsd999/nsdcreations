const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const execFileAsync = promisify(execFile);

const root = path.join(__dirname, "..");
const inputImagePath = process.env.NSD_ICON_SOURCE || path.join(root, "public", "nsd-creations-favicon-source.png");
const appDir = path.join(root, "app");
const publicDir = path.join(root, "public");
const iconsDir = path.join(publicDir, "icons");

async function generateIcons() {
  if (!fs.existsSync(inputImagePath)) {
    throw new Error(`Icon source not found: ${inputImagePath}. Set NSD_ICON_SOURCE to the supplied brand PNG.`);
  }
  fs.mkdirSync(iconsDir, { recursive: true });
  const image = sharp(inputImagePath).rotate().ensureAlpha();
  const fitSquare = (size) => image.clone().resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });

  await fitSquare(512).png().toFile(path.join(appDir, "icon.png"));
  await fitSquare(180).png().toFile(path.join(appDir, "apple-icon.png"));
  await fitSquare(180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));
  for (const size of [48, 96, 144, 192, 512]) await fitSquare(size).png().toFile(path.join(iconsDir, `icon-${size}.png`));

  // Never write PNG bytes to a file named .ico. Require a real ICO-capable encoder.
  const faviconPng = path.join(iconsDir, "_favicon-32.png");
  await fitSquare(32).png().toFile(faviconPng);
  try {
    await execFileAsync("convert", [faviconPng, "-define", "icon:auto-resize=16,32,48", path.join(appDir, "favicon.ico")]);
  } catch {
    throw new Error("Could not create a valid favicon.ico. Install ImageMagick's convert encoder or supply a real favicon.ico; do not replace it with PNG data.");
  } finally { fs.rmSync(faviconPng, { force: true }); }
  console.log("NSD Creations icon assets generated.");
}

generateIcons().catch((error) => { console.error(error.message || error); process.exitCode = 1; });
