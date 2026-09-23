import { cp, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const defaultTemplate = 'https://github.com/puzzle-fuzzy/puzzle-fuzzy-production-starter.git'

type Options = {
	name: string
	target: string
	template: string
	withWeb: boolean
}

function usage(message?: string): never {
	if (message) console.error(`Error: ${message}`)
	console.error(
		'Usage: bun scaffold-production-project.ts --name <kebab-case> [--path <new-directory>] [--template <git-url-or-path>] [--with-web]',
	)
	process.exit(1)
}

function readOptions(args: string[]): Options {
	let name: string | undefined
	let target: string | undefined
	let template = defaultTemplate
	let withWeb = false

	for (let index = 0; index < args.length; index += 1) {
		const argument = args[index]
		if (argument === '--with-web') {
			withWeb = true
			continue
		}
		const value = args[index + 1]
		if (!value || value.startsWith('--')) usage(`Missing value for ${argument}`)
		if (argument === '--name') name = value
		else if (argument === '--path') target = value
		else if (argument === '--template') template = value
		else usage(`Unknown option ${argument}`)
		index += 1
	}

	if (!name) usage('Missing --name')
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name))
		usage('--name must be lowercase kebab-case')
	return {
		name,
		target: resolve(target ?? join(process.cwd(), name)),
		template,
		withWeb,
	}
}

async function run(command: string, args: string[], cwd?: string) {
	const child = Bun.spawn([command, ...args], {
		cwd,
		stdout: 'inherit',
		stderr: 'inherit',
	})
	if ((await child.exited) !== 0)
		throw new Error(`${command} ${args.join(' ')} failed`)
}

async function ensureAbsent(target: string) {
	try {
		await stat(target)
		throw new Error(`Target already exists: ${target}`)
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
		throw error
	}
}

async function replaceProjectTokens(root: string, name: string): Promise<void> {
	for (const entry of await readdir(root, { withFileTypes: true })) {
		const path = join(root, entry.name)
		if (entry.isDirectory()) {
			await replaceProjectTokens(path, name)
			continue
		}
		if (!entry.isFile()) continue
		const content = await readFile(path, 'utf8')
		const updated = content
			.replaceAll('puzzle-fuzzy-production-starter', name)
			.replaceAll('Production Starter', name)
		if (updated !== content) await writeFile(path, updated)
	}
}

const options = readOptions(process.argv.slice(2))
await ensureAbsent(options.target)
const scratch = await mkdtemp(join(tmpdir(), 'puzzle-fuzzy-production-starter-'))

try {
	await run('git', ['clone', '--depth', '1', '--branch', 'main', options.template, scratch])
	await cp(scratch, options.target, {
		recursive: true,
		filter: (source) => basename(source) !== '.git',
	})
	if (options.withWeb) {
		await cp(join(options.target, 'variants/public-web'), join(options.target, 'apps/web'), {
			recursive: true,
		})
	}
	await replaceProjectTokens(options.target, options.name)
	await run('git', ['init', '-b', 'main'], options.target)
	console.log(`Created ${options.target}`)
	console.log('Next: configure .env, run bun install and bun run verify, then review before creating a new private remote.')
} finally {
	await rm(scratch, { recursive: true, force: true })
}
