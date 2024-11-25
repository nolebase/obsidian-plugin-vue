import { writeFile } from 'node:fs/promises'

import { join } from 'node:path'
import { cwd } from 'node:process'
import packageJSON from '../package.json' with { type: 'json' }

interface ObsidianPluginManifest {
  id: string
  name: string
  version: string
  minAppVersion: string
  description: string
  author: string
  authorUrl: string
  isDesktopOnly: boolean
}

export async function generateObsidianPluginManifest() {
  const unocssManifest = {
    id: 'obsidian-plugin-vue',
    name: 'Vue',
    version: packageJSON.version,
    minAppVersion: '1.4.0',
    description: 'An Obsidian plugin that enables you to use Vue.js components in your notes.',
    author: 'Nolebase',
    authorUrl: 'https://github.com/nolebase',
    isDesktopOnly: false,
  } satisfies ObsidianPluginManifest

  await writeFile(join(cwd(), 'dist', 'manifest.json'), JSON.stringify(unocssManifest, null, 2))
}
