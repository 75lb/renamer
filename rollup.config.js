import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: 'index.mjs',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'auto'
    },
    external: [],
    plugins: [nodeResolve({ preferBuiltins: true }), commonjs()]
  }
]
