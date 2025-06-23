
const fs = require('fs');
const path = require('path');

// SVG content
const svgContent = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#3B82F6"/>
  <path d="M16 20h32v4H16v-4zm0 8h32v4H16v-4zm0 8h24v4H16v-4z" fill="white"/>
  <path d="M44 36v12h4V36h-4z" fill="white"/>
  <circle cx="20" cy="44" r="2" fill="white"/>
  <circle cx="28" cy="40" r="2" fill="white"/>
  <circle cx="36" cy="42" r="2" fill="white"/>
  <path d="M18 44l8-4 8 2 8-6" stroke="white" stroke-width="2" fill="none"/>
</svg>`;

// Create a simple HTML file to render the SVG
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; padding: 0; }
        svg { display: block; }
    </style>
</head>
<body>
    ${svgContent}
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync('temp-svg.html', htmlContent);

console.log('SVG content saved. To convert to PNG, you can:');
console.log('1. Open temp-svg.html in a browser');
console.log('2. Take a screenshot of the SVG');
console.log('3. Or use an online SVG to PNG converter');
console.log('4. Save the result as client/public/logo.png');
