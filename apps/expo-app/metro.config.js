const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Force Metro to reset its cache. This can help with intermittent caching issues.
config.resetCache = true;

// 1. Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve modules from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force Metro to resolve symlinks to their real path for monorepo support
config.resolver.unstable_enableSymlinks = true;

// 4. Block the web-app to prevent Metro from trying to bundle it
const webAppPath = path.resolve(workspaceRoot, 'apps/web-app');
const blockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : [config.resolver.blockList].filter(Boolean);

config.resolver.blockList = [
  ...blockList,
  new RegExp(`${webAppPath}/.*`.replace(/[/\\\\]/g, '[/\\\\]')),
];

// 5. Handle monorepo packages and problematic transitive dependencies
const monorepoPackages = {
  '@directdrive/core-types': path.resolve(workspaceRoot, 'packages/core-types'),
  '@directdrive/hooks': path.resolve(workspaceRoot, 'packages/hooks'),
  '@directdrive/utils': path.resolve(workspaceRoot, 'packages/utils'),
  '@directdrive/supabase-client': path.resolve(workspaceRoot, 'packages/supabase-client'),
  '@directdrive/theme': path.resolve(workspaceRoot, 'packages/theme'),
  '@directdrive/ui': path.resolve(workspaceRoot, 'packages/ui'),
};

// Add a direct resolution for any problematic transitive dependencies
const extraModules = {
  ...monorepoPackages,
  'base64-arraybuffer': path.resolve(workspaceRoot, 'node_modules/base64-arraybuffer'),
};

config.resolver.extraNodeModules = new Proxy(extraModules, {
  get: (target, name) => {
    if (target.hasOwnProperty(name)) {
      return target[name];
    }
    // Fallback to default node module resolution
    return path.join(process.cwd(), `node_modules/${name}`);
  },
});

// 6. Add path alias for Metro
config.resolver.alias = {
  '@': projectRoot,
};

// 7. Suppress "Dynamic import" warnings by inspecting all log events
if (config.reporter && typeof config.reporter.update === 'function') {
  const originalReporterUpdate = config.reporter.update;
  config.reporter.update = (event) => {
    // Check if the event has a 'data' property, which is where log messages usually are.
    // This is a more generic approach to catch logs regardless of their type or level.
    if (event.data && Array.isArray(event.data)) {
      const logMessage = event.data.join(' ');
      if (logMessage.includes('Dynamic import')) {
        return; // Suppress the warning
      }
    }
    // For all other logs, call the original reporter
    originalReporterUpdate.call(config.reporter, event);
  };
}

module.exports = config;
