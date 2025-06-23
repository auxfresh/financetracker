
const sharp = require('sharp');
const fs = require('fs');

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

// Convert SVG to PNG
sharp(Buffer.from(svgContent))
  .png()
  .toFile('client/public/logo.png')
  .then(() => {
    console.log('PNG logo created successfully at client/public/logo.png');
    // Clean up
    fs.unlinkSync('create-png-logo.js');
    console.log('Cleanup completed');
  })
  .catch(err => {
    console.error('Error creating PNG:', err);
  });
