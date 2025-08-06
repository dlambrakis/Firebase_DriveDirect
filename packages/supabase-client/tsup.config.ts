// /home/project/packages/supabase-client/tsup.config.ts

import { defineConfig } from 'tsup';

export default defineConfig({
  // Define both entry points for the build
  entry: {
    index: 'src/index.ts',
    singleton: 'src/singleton.ts',
  },
  // Generate ESM and CJS modules
  format: ['cjs', 'esm'],
  // Generate TypeScript declaration files (.d.ts) for both entry points
  dts: true,
  // Don't code-split, keep each entry point self-contained
  splitting: false,
  // Generate source maps for easier debugging
  sourcemap: true,
  // Clean the 'dist' folder before each build
  clean: true,
});
