import { defineConfig, type Options } from 'tsup';

    export default defineConfig((options: Options) => ({
      format: ['cjs', 'esm'],
      entry: {
        index: 'src/index.ts',
      },
      dts: true,
      clean: true,
      external: ['react'],
      ...options,
    }));
