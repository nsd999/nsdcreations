import fs from 'fs';

let code = fs.readFileSync('app/layout.tsx', 'utf8');

const oldIconsRegex = /icons:\s*\{[\s\S]*?apple:\s*\[[\s\S]*?\],\s*\},/;
const newIcons = `icons: {
    icon: [
      { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)", type: "image/png" },
      { url: "/icon-light.png", media: "(prefers-color-scheme: light)", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },`;

code = code.replace(oldIconsRegex, newIcons);

const oldPreload = '<link rel="preload" href="/nsdlogo.png" as="image" type="image/png" />';
const newPreload = `<link rel="icon" href="/icon-dark.png" type="image/png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/icon-light.png" type="image/png" media="(prefers-color-scheme: light)" />
        <link rel="alternate icon" href="/favicon-dark.ico" media="(prefers-color-scheme: dark)" />
        <link rel="alternate icon" href="/favicon-light.ico" media="(prefers-color-scheme: light)" />
        <link rel="preload" href="/nsdlogo-dark.png" as="image" type="image/png" />
        <link rel="preload" href="/nsdlogo-light.png" as="image" type="image/png" />
        <link rel="preload" href="/nsdlogo.png" as="image" type="image/png" />`;

code = code.replace(oldPreload, newPreload);
fs.writeFileSync('app/layout.tsx', code, 'utf8');
console.log('Updated app/layout.tsx successfully');
