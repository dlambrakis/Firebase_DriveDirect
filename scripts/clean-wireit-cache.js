// scripts/clean-wireit-cache.js
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

function removeWireitDir(dirPath) {
  const wireitCachePath = path.join(dirPath, '.wireit');
  if (fs.existsSync(wireitCachePath)) {
    try {
      fs.rmSync(wireitCachePath, { recursive: true, force: true });
      console.log(`Successfully removed: ${wireitCachePath}`);
    } catch (err) {
      console.error(`Error removing ${wireitCachePath}:`, err.message);
    }
  } else {
    // console.log(`No .wireit directory found in: ${dirPath}`);
  }
}

console.log('Starting Wireit cache cleanup...');

// Clean root .wireit
removeWireitDir(projectRoot);

// Clean .wireit in apps/*
const appsDir = path.join(projectRoot, 'apps');
if (fs.existsSync(appsDir)) {
  fs.readdirSync(appsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(appDir => {
      removeWireitDir(path.join(appsDir, appDir.name));
    });
} else {
  console.log('No "apps" directory found, skipping apps/*/.wireit cleanup.');
}

// Clean .wireit in packages/*
const packagesDir = path.join(projectRoot, 'packages');
if (fs.existsSync(packagesDir)) {
  fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(pkgDir => {
      removeWireitDir(path.join(packagesDir, pkgDir.name));
    });
} else {
  console.log('No "packages" directory found, skipping packages/*/.wireit cleanup.');
}

console.log('Wireit cache cleanup finished.');
