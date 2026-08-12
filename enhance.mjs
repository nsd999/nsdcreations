import fs from 'fs';

async function run() {
  const apiKey = 'sk_d69efdccbdb041c287019b755b5d43e2';
  const url = 'https://api.developer.pixelcut.ai/v1/remove-background';

  const filesToProcess = [
    'public/icon.png',
    'public/nsdlogo.png',
    'public/founder.png',
    'public/apple-icon.png'
  ];

  for (const file of filesToProcess) {
    if (!fs.existsSync(file)) {
      console.log(`File not found: ${file}`);
      continue;
    }
    
    console.log(`Processing ${file}...`);
    
    try {
      const buffer = fs.readFileSync(file);
      const blob = new Blob([buffer], { type: 'image/png' });
      
      const formData = new FormData();
      formData.append('image', blob, file.split('/').pop());
      formData.append('format', 'png');
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey
        },
        body: formData
      });
      
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('image')) {
          console.log(`Successfully removed background for ${file}`);
          const imgBuffer = await res.arrayBuffer();
          fs.writeFileSync(file, Buffer.from(imgBuffer));
          console.log(`Saved enhanced file to ${file}`);
      } else {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data.result_url || data.image_url) {
               console.log(`Downloading enhanced image from ${data.result_url || data.image_url}`);
               const imgRes = await fetch(data.result_url || data.image_url);
               const imgBuffer = await imgRes.arrayBuffer();
               fs.writeFileSync(file, Buffer.from(imgBuffer));
               console.log(`Successfully replaced ${file}`);
            } else {
               console.log(`Failed to process ${file}. Response: ${text}`);
            }
          } catch (e) {
             console.log(`Failed to process ${file}. Non-JSON response: ${text}`);
          }
      }
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
}

run();
