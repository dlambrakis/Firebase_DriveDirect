import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 TAILWIND DEBUG INFORMATION')
console.log('='.repeat(50))

// Check if files exist
const configPath = path.join(__dirname, 'tailwind.config.js')
const postcssPath = path.join(__dirname, 'postcss.config.js')
const cssPath = path.join(__dirname, 'src', 'index.css')
const vitePath = path.join(__dirname, 'vite.config.ts')

console.log('📁 File Existence Check:')
console.log(`tailwind.config.js: ${fs.existsSync(configPath) ? '✅ EXISTS' : '❌ MISSING'}`)
console.log(`postcss.config.js: ${fs.existsSync(postcssPath) ? '✅ EXISTS' : '❌ MISSING'}`)
console.log(`src/index.css: ${fs.existsSync(cssPath) ? '✅ EXISTS' : '❌ MISSING'}`)
console.log(`vite.config.ts: ${fs.existsSync(vitePath) ? '✅ EXISTS' : '❌ MISSING'}`)

// Check config content
if (fs.existsSync(configPath)) {
  console.log('\n📄 Tailwind Config Content:')
  try {
    const configContent = fs.readFileSync(configPath, 'utf8')
    console.log('Raw content (first 300 chars):')
    console.log(configContent.substring(0, 300) + '...')
    
    // Check for content array
    const contentMatch = configContent.match(/content:\s*\[([\s\S]*?)\]/m)
    if (contentMatch) {
      console.log('✅ Content array found:', contentMatch[1].trim())
    } else {
      console.log('❌ No content array found')
    }
    
    // Check for safelist
    const safelistMatch = configContent.match(/safelist:\s*\[([\s\S]*?)\]/m)
    if (safelistMatch) {
      console.log('✅ Safelist found:', safelistMatch[1].trim().split(',').length, 'items')
    } else {
      console.log('❌ No safelist found')
    }
  } catch (error) {
    console.log('❌ Error reading config:', error.message)
  }
}

// Check PostCSS config
if (fs.existsSync(postcssPath)) {
  console.log('\n📄 PostCSS Config Content:')
  try {
    const postcssContent = fs.readFileSync(postcssPath, 'utf8')
    console.log('Raw content:')
    console.log(postcssContent)
    
    console.log('Contains tailwindcss:', postcssContent.includes('tailwindcss'))
    console.log('Contains autoprefixer:', postcssContent.includes('autoprefixer'))
  } catch (error) {
    console.log('❌ Error reading PostCSS config:', error.message)
  }
}

// Check CSS file
if (fs.existsSync(cssPath)) {
  console.log('\n📄 CSS File Content:')
  const cssContent = fs.readFileSync(cssPath, 'utf8')
  console.log('Full content:')
  console.log(cssContent)
  console.log('\nTailwind directives check:')
  console.log('Contains @tailwind base:', cssContent.includes('@tailwind base'))
  console.log('Contains @tailwind components:', cssContent.includes('@tailwind components'))
  console.log('Contains @tailwind utilities:', cssContent.includes('@tailwind utilities'))
}

// Check Vite config
if (fs.existsSync(vitePath)) {
  console.log('\n📄 Vite Config Content:')
  try {
    const viteContent = fs.readFileSync(vitePath, 'utf8')
    console.log('Contains tailwindcss:', viteContent.includes('tailwindcss'))
    console.log('Contains postcss:', viteContent.includes('postcss'))
    console.log('Raw content (first 500 chars):')
    console.log(viteContent.substring(0, 500) + '...')
  } catch (error) {
    console.log('❌ Error reading Vite config:', error.message)
  }
}

// Check node_modules
const tailwindPath = path.join(__dirname, 'node_modules', 'tailwindcss')
const postcssModulePath = path.join(__dirname, 'node_modules', 'postcss')
const autoprefixerPath = path.join(__dirname, 'node_modules', 'autoprefixer')

console.log('\n📦 Node Modules Check:')
console.log(`TailwindCSS: ${fs.existsSync(tailwindPath) ? '✅ INSTALLED' : '❌ MISSING'}`)
console.log(`PostCSS: ${fs.existsSync(postcssModulePath) ? '✅ INSTALLED' : '❌ MISSING'}`)
console.log(`Autoprefixer: ${fs.existsSync(autoprefixerPath) ? '✅ INSTALLED' : '❌ MISSING'}`)

// Check package.json dependencies
const packagePath = path.join(__dirname, 'package.json')
if (fs.existsSync(packagePath)) {
  console.log('\n📦 Package.json Dependencies:')
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  console.log('tailwindcss:', deps.tailwindcss || '❌ MISSING')
  console.log('postcss:', deps.postcss || '❌ MISSING')
  console.log('autoprefixer:', deps.autoprefixer || '❌ MISSING')
  console.log('vite:', deps.vite || '❌ MISSING')
  console.log('@vitejs/plugin-react:', deps['@vitejs/plugin-react'] || '❌ MISSING')
}

console.log('\n🔧 Environment Information:')
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined')
console.log('Current directory:', process.cwd())
console.log('Script directory:', __dirname)

// Try to run Tailwind CLI directly
console.log('\n🧪 Testing Tailwind CLI:')
try {
  const { execSync } = await import('child_process')
  const tailwindVersion = execSync('npx tailwindcss --help', { encoding: 'utf8', cwd: __dirname })
  console.log('✅ Tailwind CLI accessible')
} catch (error) {
  console.log('❌ Tailwind CLI error:', error.message)
}

console.log('\n' + '='.repeat(50))
console.log('🎯 RECOMMENDATIONS:')

// Provide specific recommendations
const issues = []
if (!fs.existsSync(configPath)) issues.push('Missing tailwind.config.js')
if (!fs.existsSync(postcssPath)) issues.push('Missing postcss.config.js')

if (issues.length > 0) {
  console.log('❌ Issues found:', issues.join(', '))
} else {
  console.log('✅ All config files present')
  console.log('💡 Try running: npx tailwindcss -i src/index.css -o dist/output.css --watch')
}
