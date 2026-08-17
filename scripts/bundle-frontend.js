const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FRONTEND_SRC = path.join(ROOT, '..', 'crm-frontend');
const BUILD_DIR = path.join(ROOT, '.build', 'frontend-src');
const OUTPUT_DIR = path.join(ROOT, 'frontend');

const SKIP_DIRS = new Set(['node_modules', '.next', '.git']);

function log(message) {
  console.log(`[bundle-frontend] ${message}`);
}

function rimraf(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function copyFrontendSource() {
  log('Copying crm-frontend source...');

  fs.mkdirSync(path.dirname(BUILD_DIR), { recursive: true });

  fs.cpSync(FRONTEND_SRC, BUILD_DIR, {
    recursive: true,
    filter: (src) => {
      const relative = path.relative(FRONTEND_SRC, src);
      if (!relative) return true;
      const topLevel = relative.split(path.sep)[0];
      return !SKIP_DIRS.has(topLevel);
    },
  });
}

function patchNextConfig() {
  const configPath = path.join(BUILD_DIR, 'next.config.ts');
  const original = fs.readFileSync(configPath, 'utf8');

  if (original.includes("output: 'standalone'")) {
    return;
  }

  const patched = original.replace(
    'const nextConfig: NextConfig = {',
    "const nextConfig: NextConfig = {\n  output: 'standalone',"
  );

  fs.writeFileSync(configPath, patched, 'utf8');
  log('Enabled standalone output in temporary build copy only.');
}

function runBuild() {
  log('Installing frontend dependencies...');
  execSync('npm ci', { cwd: BUILD_DIR, stdio: 'inherit' });

  log('Building latest crm-frontend...');
  execSync('npm run build', { cwd: BUILD_DIR, stdio: 'inherit' });
}

function assembleStandaloneBundle() {
  const standaloneDir = path.join(BUILD_DIR, '.next', 'standalone');
  const staticDir = path.join(BUILD_DIR, '.next', 'static');
  const publicDir = path.join(BUILD_DIR, 'public');

  if (!fs.existsSync(standaloneDir)) {
    throw new Error('Standalone build output not found. Build failed.');
  }

  rimraf(OUTPUT_DIR);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  fs.cpSync(standaloneDir, OUTPUT_DIR, { recursive: true });
  fs.cpSync(staticDir, path.join(OUTPUT_DIR, '.next', 'static'), { recursive: true });

  if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, path.join(OUTPUT_DIR, 'public'), { recursive: true });
  }

  log(`Bundled frontend ready at ${OUTPUT_DIR}`);
}

function main() {
  if (!fs.existsSync(FRONTEND_SRC)) {
    throw new Error(`crm-frontend not found at ${FRONTEND_SRC}`);
  }

  rimraf(path.join(ROOT, '.build'));
  rimraf(OUTPUT_DIR);

  copyFrontendSource();
  patchNextConfig();
  runBuild();
  assembleStandaloneBundle();
  rimraf(path.join(ROOT, '.build'));

  log('Done. Latest CRM frontend (with OTP UI) is bundled for desktop.');
}

main();
