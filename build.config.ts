import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { defineBuildConfig } from 'unbuild'
import builtins from 'builtin-modules'

const execAsync = promisify(exec)

export default defineBuildConfig({
  outDir: './dist',
  sourcemap: true,
  declaration: false,
  externals: [
    // Obsidian
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    // Builtins
    ...builtins,
  ],
  rollup: {
    esbuild: {
      format: 'cjs',
    },
    output: {
      dir: './dist',
      format: 'cjs',
      sourcemap: true,
      entryFileNames: 'main.js',
    },
    // required for unocss, ofetch, etc.
    // otherwise unbuild will detect them as external
    // dependencies that are inline implicitly external
    // by esbuild
    inlineDependencies: true,
  },
  hooks: {
    'build:before': async () => {
      await execAsync('rm -rf ./main.js')
      await execAsync('rm -rf ./main.js.map')
    },
    'build:done': async () => {
      await execAsync('cp ./dist/main.js ./main.js')
      await execAsync('cp ./dist/main.js.map ./main.js.map')
    },
  },
})
