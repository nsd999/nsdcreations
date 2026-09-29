const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = 'C:\\Users\\Sai Dheeraj Nalkari\\.gemini\\antigravity-ide\\brain\\f0b2b26d-bffc-408e-8bc7-4e350cd5aa26\\.user_uploaded\\media_1790657383256.png';
const appDir = path.join(__dirname, '..', 'app');
const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  const image = sharp(inputImagePath);
  
  // App router icons
  await image.resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(appDir, 'icon.png'));
  await image.resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(appDir, 'apple-icon.png'));
  
  // favicon.ico (We can just use a 48x48 png for this since browsers support png as ico or we can use another tool to create real ICO, but sharp doesn't output .ico directly. Actually, Next.js can use favicon.ico, but it also accepts favicon.ico as a PNG formatted file renamed to .ico or we can just use `app/icon.png` and delete `app/favicon.ico`. Actually, let's keep it clean: delete `app/favicon.ico` and let Next.js use `app/icon.png` which handles modern browsers, or we can use 32x32 for favicon.ico.)
  // Let's generate a png for now, if it needs to be an ico, we can just omit it and let Next.js use icon.png. Or generate 48x48 as favicon.ico just in case.
  // Wait, sharp does NOT support ICO format output. So writing a png to .ico might confuse some very old browsers, but modern ones don't care. Let's just output png renamed to ico.
  await image.resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(appDir, 'favicon.ico'));

  // Public icons
  const sizes = [48, 96, 144, 192, 512];
  for (const size of sizes) {
    await image.resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
               .toFile(path.join(iconsDir, `icon-${size}.png`));
  }
  
  // Apple touch icon in public
  await image.resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(publicDir, 'apple-touch-icon.png'));
  
  console.log('Icons generated successfully.');
}

generateIcons().catch(console.error);
