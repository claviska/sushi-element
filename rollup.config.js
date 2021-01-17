import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    nodeResolve(),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
