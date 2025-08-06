const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const nodeModulesPath = path.join(projectRoot, 'node_modules');

// Check if the root node_modules directory exists. If not, run the full setup.
if (!fs.existsSync(nodeModulesPath)) {
  console.log('🚀 First-time setup detected. Installing dependencies and building packages...');
  console.log('This might take a few minutes.');

  try {
    console.log('\n[1/3] Running npm install...');
    // Per your request, running npm install first.
    execSync('npm install', { stdio: 'inherit', cwd: projectRoot });

    console.log('\n[2/3] Running pnpm install...');
    // pnpm install will set up the monorepo workspaces correctly.
    execSync('pnpm install', { stdio: 'inherit', cwd: projectRoot });

    console.log('\n[3/3] Running pnpm build...');
    // Build shared packages required by the apps.
    execSync('pnpm build', { stdio: 'inherit', cwd: projectRoot });

    console.log('\n✅ Setup complete!');
  } catch (error) {
    console.error('❌ Initial setup failed. Please check the logs above for errors.');
    console.error(error);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed. Skipping setup.');
}

console.log('\n🚀 Starting development servers...');
try {
  // This was the original "dev" command, which starts the web and expo apps.
  execSync('pnpm --filter="@directdrive/*-app" --parallel dev', { stdio: 'inherit', cwd: projectRoot });
} catch (error) {
  // execSync throws an error on non-zero exit codes.
  // The error from the child process is usually sufficient for debugging.
  console.error('❌ Development server process exited with an error.');
  // Exit with the same status code as the failed child process.
  process.exit(error.status || 1);
}
