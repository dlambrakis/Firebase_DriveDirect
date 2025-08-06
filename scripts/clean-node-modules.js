// scripts/clean-node-modules.js
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

console.log('Starting node_modules and pnpm-lock.yaml cleanup...');

// Remove root node_modules (pnpm workspaces typically have a single root node_modules)
const rootNodeModulesPath = path.join(projectRoot, 'node_modules');
if (fs.existsSync(rootNodeModulesPath)) {
  try {
    fs.rmSync(rootNodeModulesPath, { recursive: true, force: true });
    console.log(`Successfully removed: ${rootNodeModulesPath}`);
  } catch (err) {
    console.error(`Error removing ${rootNodeModulesPath}:`, err.message);
  }
} else {
  console.log('No node_modules directory found at project root.');
}

// Remove pnpm-lock.yaml
const pnpmLockPath = path.join(projectRoot, 'pnpm-lock.yaml');
if (fs.existsSync(pnpmLockPath)) {
  try {
    fs.unlinkSync(pnpmLockPath);
    console.log(`Successfully removed: ${pnpmLockPath}`);
  } catch (err) {
    console.error(`Error removing ${pnpmLockPath}:`, err.message);
  }
} else {
  console.log('No pnpm-lock.yaml found at project root.');
}

console.log('node_modules and pnpm-lock.yaml cleanup finished.');

// Remove package-lock.json
const packageLockPath = path.join(projectRoot, 'package-lock.json');
if (fs.existsSync(packageLockPath)) {
  try {
    fs.unlinkSync(packageLockPath);
    console.log(`Successfully removed: ${packageLockPath}`);
  } catch (err) {
    console.error(`Error removing ${packageLockPath}:`, err.message);
  }
} else {
  console.log('No package-lock.json found at project root.');
}

console.log('node_modules and package-lock.json cleanup finished.');
