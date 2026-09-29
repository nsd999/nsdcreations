const fs = require('fs');

let content = fs.readFileSync('app/layout.tsx', 'utf8');

const metadataRegex = /icons:\s*\{\s*icon:\s*\[[\s\S]*?\],\s*shortcut:\s*\[[\s\S]*?\],\s*apple:\s*\[[\s\S]*?\],\s*\},/g;
content = content.replace(metadataRegex, 'manifest: "/manifest.json",');

const linkRegex1 = /<link rel="icon" href="\/nsdlogo\.png" type="image\/png" \/>\r?\n\s*/g;
const linkRegex2 = /<link rel="shortcut icon" href="\/nsdlogo\.png" type="image\/png" \/>\r?\n\s*/g;
const linkRegex3 = /<link rel="apple-touch-icon" href="\/nsdlogo\.png" type="image\/png" \/>\r?\n\s*/g;

content = content.replace(linkRegex1, '');
content = content.replace(linkRegex2, '');
content = content.replace(linkRegex3, '');

fs.writeFileSync('app/layout.tsx', content);
console.log('Layout updated.');
