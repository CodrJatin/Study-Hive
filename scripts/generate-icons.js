const sharp = require('sharp');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const iconsDir = path.join(projectRoot, 'public', 'icons');


async function resize() {
  // icon-192 from icon-512
  await sharp(path.join(iconsDir, 'icon-512.png'))
    .resize(192, 192)
    .toFile(path.join(iconsDir, 'icon-192.png'));
  console.log('icon-192.png created');

  // maskable-192 from maskable-512
  await sharp(path.join(iconsDir, 'maskable-512.png'))
    .resize(192, 192)
    .toFile(path.join(iconsDir, 'maskable-192.png'));
  console.log('maskable-192.png created');

  // Apple touch icon (180px)
  await sharp(path.join(iconsDir, 'icon-512.png'))
    .resize(180, 180)
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png created');

  // Favicon 32px
  await sharp(path.join(iconsDir, 'maskable-512.png'))
    .resize(32, 32)
    .toFile(path.join(projectRoot, 'public', 'favicon-32.png'));
  console.log('favicon-32.png created');
}

resize().catch(console.error);
