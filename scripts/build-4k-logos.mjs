import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildLogos() {
  const originalJpgPath = 'C:/Users/Sai Dheeraj Nalkari/.gemini/antigravity/brain/eca95973-85a9-4561-b727-663c869828e8/.user_uploaded/media_1793291587085_2422fbe9.jpg';
  const cutoutPath = path.join(__dirname, '..', 'public', 'nsdlogo-raw-cutout.png');
  const publicDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'app');
  const iconsDir = path.join(publicDir, 'icons');

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  console.log('1. Loading original 1024x1024 and remove.bg cutout...');
  const { data: alpha1024 } = await sharp(cutoutPath)
    .extractChannel(3)
    .resize(1024, 1024, { kernel: 'cubic' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: rgb1024 } = await sharp(originalJpgPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const refined1024Rgba = Buffer.alloc(1024 * 1024 * 4);

  for (let i = 0; i < 1024 * 1024; i++) {
    const srcRgb = i * 3;
    const dstRgba = i * 4;

    let r = rgb1024[srcRgb];
    let g = rgb1024[srcRgb + 1];
    let b = rgb1024[srcRgb + 2];
    const maxVal = Math.max(r, g, b);
    let a = alpha1024[i];

    // Background threshold
    if (a < 8 || maxVal <= 3) {
      refined1024Rgba[dstRgba] = 0;
      refined1024Rgba[dstRgba + 1] = 0;
      refined1024Rgba[dstRgba + 2] = 0;
      refined1024Rgba[dstRgba + 3] = 0;
      continue;
    }

    // Smooth transition at boundary
    if (maxVal < 22) {
      const edgeWeight = (maxVal - 3) / 19;
      a = Math.min(a, Math.round(edgeWeight * 255));
    }

    // Un-premultiply edge pixels to remove dark halo
    if (a > 0 && a < 250) {
      const alphaNorm = a / 255;
      const boost = 1 / Math.max(0.18, alphaNorm);
      r = Math.min(255, Math.round(r * boost));
      g = Math.min(255, Math.round(g * boost));
      b = Math.min(255, Math.round(b * boost));
    }

    refined1024Rgba[dstRgba] = r;
    refined1024Rgba[dstRgba + 1] = g;
    refined1024Rgba[dstRgba + 2] = b;
    refined1024Rgba[dstRgba + 3] = a;
  }

  const base1024Image = sharp(refined1024Rgba, {
    raw: { width: 1024, height: 1024, channels: 4 }
  });

  console.log('2. Generating 4K Master (3840x3840) with Lanczos3 and fine sharpening...');
  const master4kBuffer = await base1024Image
    .clone()
    .resize(3840, 3840, { kernel: 'lanczos3' })
    .sharpen({
      sigma: 1.2,
      m1: 1.6,
      m2: 0.6
    })
    .png({ compressionLevel: 8 })
    .toBuffer();

  const master4kPath = path.join(publicDir, 'nsdlogo-4k.png');
  fs.writeFileSync(master4kPath, master4kBuffer);
  console.log('Saved 4K Master:', master4kPath, `(${Math.round(master4kBuffer.byteLength / 1024)} KB)`);

  console.log('3. Generating Standard Transparent Logo (1024x1024)...');
  const logo1024Buffer = await sharp(master4kBuffer)
    .resize(1024, 1024, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8, m1: 1.3, m2: 0.5 })
    .png({ compressionLevel: 8 })
    .toBuffer();

  const standardLogoPath = path.join(publicDir, 'nsdlogo.png');
  fs.writeFileSync(standardLogoPath, logo1024Buffer);
  console.log('Saved standard logo:', standardLogoPath, `(${Math.round(logo1024Buffer.byteLength / 1024)} KB)`);

  console.log('4. Generating Dark Mode Variant with Luminous Rim (nsdlogo-dark.png)...');
  const { data: maskData } = await sharp(logo1024Buffer)
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const blurredMaskBuffer = await sharp(maskData, { raw: { width: 1024, height: 1024, channels: 1 } })
    .blur(5)
    .raw()
    .toBuffer();

  const rimRgba = Buffer.alloc(1024 * 1024 * 4);
  for (let i = 0; i < 1024 * 1024; i++) {
    const origA = maskData[i];
    const blurA = blurredMaskBuffer[i];
    if (origA < 220 && blurA > 10) {
      const rimAlpha = Math.min(190, Math.round((blurA - origA * 0.75) * 1.3));
      const idx = i * 4;
      // Vibrant indigo-violet rim (#818cf8) to give 3D pop on dark themes
      rimRgba[idx] = 129;
      rimRgba[idx + 1] = 140;
      rimRgba[idx + 2] = 248;
      rimRgba[idx + 3] = Math.max(0, rimAlpha);
    }
  }

  const darkVariantBuffer = await sharp(rimRgba, { raw: { width: 1024, height: 1024, channels: 4 } })
    .composite([{ input: logo1024Buffer, blend: 'over' }])
    .png({ compressionLevel: 8 })
    .toBuffer();

  const darkLogoPath = path.join(publicDir, 'nsdlogo-dark.png');
  fs.writeFileSync(darkLogoPath, darkVariantBuffer);
  console.log('Saved dark mode logo:', darkLogoPath);

  console.log('5. Generating Light Mode Variant with Natural Grounding Shadow (nsdlogo-light.png)...');
  const blurredShadowBuffer = await sharp(maskData, { raw: { width: 1024, height: 1024, channels: 1 } })
    .blur(7)
    .raw()
    .toBuffer();

  const shadowRgba = Buffer.alloc(1024 * 1024 * 4);
  for (let i = 0; i < 1024 * 1024; i++) {
    const origA = maskData[i];
    const blurA = blurredShadowBuffer[i];
    if (origA < 200 && blurA > 10) {
      const shadowAlpha = Math.min(140, Math.round((blurA - origA * 0.85) * 0.9));
      const idx = i * 4;
      // Soft dark slate shadow (#0f172a)
      shadowRgba[idx] = 15;
      shadowRgba[idx + 1] = 23;
      shadowRgba[idx + 2] = 42;
      shadowRgba[idx + 3] = Math.max(0, shadowAlpha);
    }
  }

  const lightVariantBuffer = await sharp(shadowRgba, { raw: { width: 1024, height: 1024, channels: 4 } })
    .composite([{ input: logo1024Buffer, blend: 'over' }])
    .png({ compressionLevel: 8 })
    .toBuffer();

  const lightLogoPath = path.join(publicDir, 'nsdlogo-light.png');
  fs.writeFileSync(lightLogoPath, lightVariantBuffer);
  console.log('Saved light mode logo:', lightLogoPath);

  console.log('6. Generating Theme-Aware App Icons and Favicons...');
  // Standard app/icon.png (512x512)
  await sharp(master4kBuffer)
    .resize(512, 512, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6, m1: 1.2 })
    .png()
    .toFile(path.join(appDir, 'icon.png'));

  // Theme icons: icon-dark.png and icon-light.png
  await sharp(darkVariantBuffer)
    .resize(512, 512, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6, m1: 1.2 })
    .png()
    .toFile(path.join(appDir, 'icon-dark.png'));

  await sharp(lightVariantBuffer)
    .resize(512, 512, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6, m1: 1.2 })
    .png()
    .toFile(path.join(appDir, 'icon-light.png'));

  await sharp(darkVariantBuffer)
    .resize(512, 512, { kernel: 'lanczos3' })
    .png()
    .toFile(path.join(publicDir, 'icon-dark.png'));

  await sharp(lightVariantBuffer)
    .resize(512, 512, { kernel: 'lanczos3' })
    .png()
    .toFile(path.join(publicDir, 'icon-light.png'));

  // Apple touch icon (180x180)
  await sharp(master4kBuffer)
    .resize(180, 180, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.2 })
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  await sharp(master4kBuffer)
    .resize(180, 180, { kernel: 'lanczos3' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicons (48x48)
  await sharp(master4kBuffer)
    .resize(48, 48, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.4 })
    .png()
    .toFile(path.join(appDir, 'favicon.ico'));

  await sharp(master4kBuffer)
    .resize(48, 48, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.4 })
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  // Also dark & light favicons for browser tabs
  await sharp(darkVariantBuffer)
    .resize(48, 48, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.4 })
    .png()
    .toFile(path.join(publicDir, 'favicon-dark.ico'));

  await sharp(lightVariantBuffer)
    .resize(48, 48, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.4 })
    .png()
    .toFile(path.join(publicDir, 'favicon-light.ico'));

  // Responsive PWA icons in public/icons
  const sizes = [48, 96, 144, 192, 512];
  for (const size of sizes) {
    await sharp(master4kBuffer)
      .resize(size, size, { kernel: 'lanczos3' })
      .sharpen({ sigma: 0.5, m1: 1.2 })
      .png()
      .toFile(path.join(iconsDir, `icon-${size}.png`));
  }

  // Also copy the original high-res jpg to public/nsdlogo-original.jpg
  fs.copyFileSync(originalJpgPath, path.join(publicDir, 'nsdlogo-original.jpg'));
  console.log('Updated public/nsdlogo-original.jpg');

  console.log('SUCCESS! All 4K logos and theme-adaptive icons generated perfectly.');
}

buildLogos().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});
