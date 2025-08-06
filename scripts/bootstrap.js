const { execSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 Starting project bootstrap: clean, install, and build...');
console.log('This might take a few minutes.');

try {
  console.log('\n[1/3] Cleaning workspace...');
  execSync('pnpm clean', { stdio: 'inherit', cwd: projectRoot });

  console.log('\n[2/3] Installing dependencies...');
  // pnpm install will set up the monorepo workspaces correctly.
  execSync('pnpm install', { stdio: 'inherit', cwd: projectRoot });

  console.log('\n[3/3] Building packages...');
  // Build shared packages required by the apps.
  execSync('pnpm build', { stdio: 'inherit', cwd: projectRoot });

  console.log('\n✅ Project bootstrap complete!');
  console.log('You can now start the development servers with: pnpm dev');

} catch (error)
{
  console.error('❌ Project bootstrap failed. Please check the logs above for errors.');
  console.error(error);
  process.exit(1);
}
