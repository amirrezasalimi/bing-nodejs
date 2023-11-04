const build = require('esbuild').build
const NodeResolve = require('@esbuild-plugins/node-resolve').default
const esbuildPluginTsc = require('esbuild-plugin-tsc')
const execSync = require('child_process').execSync

const packageJson = require('./package.json'); // Load the package.json file
let externalPkgs = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
]
build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    platform: 'node',
    bundle: true,
    format: "esm",
    tsconfig: 'tsconfig.json',
    external: externalPkgs,
    plugins: [
        {
            name: 'TypeScriptDeclarationsPlugin',
            setup(build) {
                build.onEnd((result) => {
                    if (result.errors.length > 0) return
                    // execSync('tsc -p .') // for now i run this manually
                })
            },
        }
    ],
})