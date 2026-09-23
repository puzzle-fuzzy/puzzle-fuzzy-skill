import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

type PackageJson = {
	packageManager?: unknown
	devDependencies?: Record<string, string>
	scripts?: Record<string, string>
}

type BiomeConfig = {
	files?: { ignore?: string[] }
}

function usage(message?: string): never {
	if (message) console.error(`Error: ${message}`)
	console.error('Usage: bun add-production-e2e.ts --path <existing-bun-workspace>')
	process.exit(1)
}

function readTarget(args: string[]): string {
	if (args.length !== 2 || args[0] !== '--path') usage('Expected --path')
	return resolve(args[1])
}

async function mustNotExist(path: string) {
	try {
		await access(path)
		throw new Error(`Refusing to overwrite existing ${path}`)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
		throw error
	}
}

async function run(command: string, args: string[], cwd: string) {
	const child = Bun.spawn([command, ...args], {
		cwd,
		stdout: 'inherit',
		stderr: 'inherit',
	})
	if ((await child.exited) !== 0)
		throw new Error(`${command} ${args.join(' ')} failed`)
}

const target = readTarget(process.argv.slice(2))
const packagePath = join(target, 'package.json')
const packageJson = JSON.parse(await readFile(packagePath, 'utf8')) as PackageJson
if (typeof packageJson.packageManager !== 'string' || !packageJson.packageManager.startsWith('bun@'))
	usage('Target package.json must declare packageManager as bun@<version>')

const configPath = join(target, 'playwright.config.ts')
const e2ePath = join(target, 'tests', 'e2e')
await mustNotExist(configPath)
await mustNotExist(e2ePath)

if (packageJson.scripts?.['test:e2e'])
	throw new Error('Refusing to overwrite existing test:e2e script')

packageJson.devDependencies = {
	...packageJson.devDependencies,
	'@playwright/test': '^1.55.0',
}
packageJson.scripts = {
	...packageJson.scripts,
	'test:e2e': 'bunx playwright test',
}

await writeFile(packagePath, `${JSON.stringify(packageJson, null, '\t')}\n`)
await writeFile(
	configPath,
	`import { defineConfig } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5174'
const localCommand = process.env.E2E_START_COMMAND

export default defineConfig({
	testDir: './tests/e2e',
	forbidOnly: Boolean(process.env.CI),
	reporter: process.env.CI ? 'github' : 'list',
	use: { baseURL, trace: 'on-first-retry' },
	...(localCommand
		? {
				webServer: {
					command: localCommand,
					url: baseURL,
					reuseExistingServer: !process.env.CI,
				},
			}
		: {}),
})
`,
)
await mkdir(e2ePath, { recursive: true })
await writeFile(
	join(e2ePath, 'README.md'),
	`# E2E boundary

Add a real Playwright specification here only for an approved, stable page and primary interaction. Set E2E_BASE_URL and, when the test runner should start it, E2E_START_COMMAND to a deterministic local service command. Do not add placeholder tests, credentials, or browser binaries.\n`,
)

const ignorePath = join(target, '.gitignore')
let ignore = ''
try {
	ignore = await readFile(ignorePath, 'utf8')
} catch (error) {
	if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
}
const additions = ['playwright-report/', 'test-results/'].filter(
	(entry) => !ignore.split(/\r?\n/).includes(entry),
)
if (additions.length > 0)
	await writeFile(ignorePath, `${ignore.trimEnd()}\n${additions.join('\n')}\n`)

const biomePath = join(target, 'biome.json')
const biomeConfig = JSON.parse(await readFile(biomePath, 'utf8')) as BiomeConfig
const ignored = biomeConfig.files?.ignore ?? []
const biomeAdditions = ['**/playwright-report', '**/test-results'].filter(
	(entry) => !ignored.includes(entry),
)
if (biomeAdditions.length > 0) {
	biomeConfig.files = { ...biomeConfig.files, ignore: [...ignored, ...biomeAdditions] }
	await writeFile(biomePath, `${JSON.stringify(biomeConfig, null, '\t')}\n`)
}

await run('bun', ['install'], target)
await run('bun', ['x', 'biome', 'format', '--write', 'package.json', 'biome.json'], target)
console.log('E2E module added. Next: add a real spec, then configure the approved CI browser installation.')
