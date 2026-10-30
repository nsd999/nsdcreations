import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processKaraokeLogo() {
  const inputImagePath = 'C:/Users/Sai Dheeraj Nalkari/.gemini/antigravity/brain/eca95973-85a9-4561-b727-663c869828e8/.user_uploaded/media_1793292943247_5dcf96f8.png';
  const publicDir = path.join(__dirname, '..', 'public');
  const karaokeDir = path.join(__dirname, '..', 'app', 'nsdkaraoke');

  console.log('Processing NSD Karaoke logo...');

  const image = sharp(inputImagePath);
  
  // 1. High-res logo in public/nsdkaraoke-logo.png (1024x1024)
  await image
    .clone()
    .resize(1024, 1024, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6, m1: 1.2 })
    .png({ compressionLevel: 8 })
    .toFile(path.join(publicDir, 'nsdkaraoke-logo.png'));
  console.log('Saved public/nsdkaraoke-logo.png');

  // 2. 512x512 icon in public/nsdkaraoke-icon.png
  await image
    .clone()
    .resize(512, 512, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.2 })
    .png({ compressionLevel: 8 })
    .toFile(path.join(publicDir, 'nsdkaraoke-icon.png'));
  console.log('Saved public/nsdkaraoke-icon.png');

  // 3. Next.js route-segmented icons in app/nsdkaraoke/
  // Next.js automatically associates app/nsdkaraoke/icon.png as the favicon for /nsdkaraoke
  await image
    .clone()
    .resize(512, 512, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.2 })
    .png({ compressionLevel: 8 })
    .toFile(path.join(karaokeDir, 'icon.png'));
  console.log('Saved app/nsdkaraoke/icon.png');

  await image
    .clone()
    .resize(180, 180, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.2 })
    .png({ compressionLevel: 8 })
    .toFile(path.join(karaokeDir, 'apple-icon.png'));
  console.log('Saved app/nsdkaraoke/apple-icon.png');

  // 4. Smaller icon sizes in public/icons/ for PWA or explicit link
  const iconsDir = path.join(publicDir, 'icons');
  await image
    .clone()
    .resize(48, 48, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.5, m1: 1.3 })
    .png()
    .toFile(path.join(iconsDir, 'nsdkaraoke-48.png'));
  console.log('Saved public/icons/nsdkaraoke-48.png');

  console.log('All NSD Karaoke logo and icon assets successfully generated!');
}

processKaraokeLogo().catch((err) => {
  console.error('Error generating NSD Karaoke assets:', err);
  process.exit(1);
});

