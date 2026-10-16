import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Step 1: Restoring template for Vite build...');
const templatePath = path.join(rootDir, 'src', 'index.template.html');
const rootIndexPath = path.join(rootDir, 'index.html');
fs.copyFileSync(templatePath, rootIndexPath);

console.log('🔨 Step 2: Running vite build...');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
execSync(`${npmCmd} run vite-build`, { stdio: 'inherit', cwd: rootDir });

const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');

console.log('📦 Step 3: Preparing 404.html in dist...');
const distIndex = path.join(distDir, 'index.html');
const dist404 = path.join(distDir, '404.html');
fs.copyFileSync(distIndex, dist404);

console.log('📂 Step 4: Syncing to docs/ for GitHub Pages /docs folder...');
fs.cpSync(distDir, docsDir, { recursive: true, force: true });

console.log('🌐 Step 5: Syncing production files to root for GitHub Pages / (root) folder...');
// Copy dist/index.html and 404.html to root
fs.copyFileSync(distIndex, rootIndexPath);
fs.copyFileSync(dist404, path.join(rootDir, '404.html'));

// Copy dist/assets to root assets/
const distAssets = path.join(distDir, 'assets');
if (fs.existsSync(distAssets)) {
  fs.cpSync(distAssets, assetsDir, { recursive: true, force: true });
}

console.log('✅ Build complete! Both root / and docs/ are fully built and ready for GitHub Pages.');
