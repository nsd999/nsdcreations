import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function removeBg() {
  const apiKey = process.env.REMOVE_BG_API_KEY || '';
  const inputImagePath = 'C:/Users/Sai Dheeraj Nalkari/.gemini/antigravity/brain/eca95973-85a9-4561-b727-663c869828e8/.user_uploaded/media_1793291587085_2422fbe9.jpg';
  const outputPath = path.join(__dirname, '..', 'public', 'nsdlogo-raw-cutout.png');

  console.log('Reading source image from:', inputImagePath);
  const imageBuffer = fs.readFileSync(inputImagePath);
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('image_file', blob, 'nsdcreations-logo.jpg');
  formData.append('size', 'preview');
  formData.append('format', 'png');

  console.log('Calling remove.bg API...');
  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('remove.bg API Error:', response.status, errorText);
    process.exit(1);
  }

  const resultBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(resultBuffer));
  console.log('Successfully saved cutout to:', outputPath);
  console.log('File size:', resultBuffer.byteLength, 'bytes');
}

removeBg().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
