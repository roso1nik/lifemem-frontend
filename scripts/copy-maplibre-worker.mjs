import { cpSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkgPath = require.resolve('maplibre-gl/package.json')
const { version } = JSON.parse(readFileSync(pkgPath, 'utf8'))
const dist = join(dirname(pkgPath), 'dist')
const vendorRoot = join(root, 'public', 'vendor', 'maplibre-gl')
const outDir = join(vendorRoot, version)

// Drop workers from other MapLibre versions so stale URLs cannot 404 → HTML.
rmSync(vendorRoot, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const workerName = 'maplibre-gl-csp-worker.js'
const workerSrc = join(dist, workerName)
const workerStat = statSync(workerSrc)
if (workerStat.size < 1000) {
    throw new Error(`${workerName} looks invalid (${workerStat.size} bytes)`)
}

cpSync(workerSrc, join(outDir, workerName))
console.log(`Copied MapLibre CSP worker (${workerStat.size} bytes) → public/vendor/maplibre-gl/${version}/`)
