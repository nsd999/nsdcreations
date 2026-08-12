import fs from 'fs';

async function testPixelcutUpscaler() {
  const apiKey = 'sk_d69efdccbdb041c287019b755b5d43e2';
  
  // Create a 1x1 png for testing
  const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  
  const endpoints = [
    'https://api.developer.pixelcut.ai/v1/upscaler',
    'https://api.developer.pixelcut.ai/v1/upscale'
  ];

  for (const url of endpoints) {
      console.log(`Testing ${url}...`);
      const blob = new Blob([tinyPng], { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', blob, 'test.png');
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': apiKey
        },
        body: formData
      });
      
      console.log(res.status, res.statusText);
      const text = await res.text();
      console.log(text);
  }
}

testPixelcutUpscaler();
