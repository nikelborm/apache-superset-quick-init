import { nodeResolve } from '@rollup/plugin-node-resolve';
import { visualizer } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/apache-superset-quick-init.js',
  output: {
    dir: 'dist/minified',
    format: 'es',
    sourcemap: true,
    compact: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    visualizer({
      sourcemap: true,
      filename: 'gh-page/bundled_deps/index.html',
    }),
    terser(),
  ],
};
