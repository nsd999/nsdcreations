import sharp from 'sharp';

async function getColor() {
  const image = sharp('C:\\Users\\dheer\\.gemini\\antigravity-ide\\brain\\be2dc735-2575-4001-913d-9db46a3caa68\\media__1786510078516.jpg');
  const metadata = await image.metadata();
  
  // get 1 pixel from the top-left corner
  const pixel = await image.extract({ left: 10, top: 10, width: 1, height: 1 }).raw().toBuffer();
  console.log(`RGB: ${pixel[0]}, ${pixel[1]}, ${pixel[2]}`);
  
  const hex = '#' + pixel[0].toString(16).padStart(2, '0') + pixel[1].toString(16).padStart(2, '0') + pixel[2].toString(16).padStart(2, '0');
  console.log(`Hex: ${hex}`);
}

getColor();
