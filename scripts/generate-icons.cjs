const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const execFileAsync = promisify(execFile);
const root = path.join(__dirname, "..");
const inputImagePath = process.env.NSD_ICON_SOURCE || path.join(root, "public", "icons", "icon-192.png");
const appDir = path.join(root, "app");
const publicDir = path.join(root, "public");
const iconsDir = path.join(publicDir, "icons");
async function generateIcons() {
  if (!fs.existsSync(inputImagePath)) throw new Error(`Icon source not found: ${inputImagePath}`);
  fs.mkdirSync(iconsDir, { recursive: true });
  const image = sharp(inputImagePath).rotate().ensureAlpha();
  const square = (size) => image.clone().resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
  await square(192).png().toFile(path.join(appDir, "icon.png"));
  await square(180).png().toFile(path.join(appDir, "apple-icon.png"));
  await square(180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));
  for (const size of [48, 96, 144, 192, 512]) await square(size).png().toFile(path.join(iconsDir, `icon-${size}.png`));
  const preview = path.join(iconsDir, "_favicon-32.png");
  await square(32).png().toFile(preview);
  try { await execFileAsync("convert", [preview, "-define", "icon:auto-resize=16,32", path.join(appDir, "favicon.ico")]); }
  catch { throw new Error("Creating favicon.ico requires ImageMagick convert; refusing to mislabel PNG as ICO."); }
  finally { fs.rmSync(preview, { force: true }); }
  console.log("NSD Creations icons generated.");
}
generateIcons().catch((error) => { console.error(error.message || error); process.exitCode = 1; });
