const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectRoot = '/home/project';
const lockfilePath = path.join(projectRoot, 'pnpm-lock.yaml');

function run(command) {
  console.log(`\n> ${command}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

function getHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

console.log('--- Starting Lockfile Diagnosis ---');

// 1. Clean state
run('pnpm clean');

// 2. First install
run('pnpm install');

// 3. Capture first lockfile state
if (!fs.existsSync(lockfilePath)) {
  console.error('[ERROR] pnpm-lock.yaml not found after first install.');
  process.exit(1);
}
const lockfile1 = fs.readFileSync(lockfilePath, 'utf-8');
const hash1 = getHash(lockfile1);
console.log('\n[INFO] Captured state of pnpm-lock.yaml after first install.');
console.log(`       - Length: ${lockfile1.length} characters`);
console.log(`       - SHA256: ${hash1}`);


// 4. Second install
run('pnpm install');

// 5. Capture second lockfile state
if (!fs.existsSync(lockfilePath)) {
  console.error('[ERROR] pnpm-lock.yaml not found after second install.');
  process.exit(1);
}
const lockfile2 = fs.readFileSync(lockfilePath, 'utf-8');
const hash2 = getHash(lockfile2);
console.log('\n[INFO] Captured state of pnpm-lock.yaml after second install.');
console.log(`       - Length: ${lockfile2.length} characters`);
console.log(`       - SHA256: ${hash2}`);

// 6. Compare the two lockfiles
console.log('\n--- Lockfile Comparison Results ---');

if (hash1 === hash2) {
  console.log('✅ The lockfile is stable. Hashes match.');
  process.exit(0);
}

console.log('❌ The lockfile is UNSTABLE. Hashes do not match.');

const lines1 = new Set(lockfile1.split('\n'));
const lines2 = new Set(lockfile2.split('\n'));

const addedLines = [];
for (const line of lines2) {
  if (!lines1.has(line)) {
    addedLines.push(line);
  }
}

const removedLines = [];
for (const line of lines1) {
  if (!lines2.has(line)) {
    removedLines.push(line);
  }
}

if (addedLines.length > 0) {
  console.log(`\n--- ${addedLines.length} Lines ADDED on second install ---`);
  console.log(addedLines.join('\n'));
} else {
  console.log('\n--- No lines were added. ---');
}

if (removedLines.length > 0) {
  console.log(`\n--- ${removedLines.length} Lines REMOVED on second install ---`);
  console.log(removedLines.join('\n'));
} else {
  console.log('\n--- No lines were removed. ---');
}

console.log('\n--- Diagnosis Complete ---');
process.exit(1); // Exit with an error code to indicate instability
