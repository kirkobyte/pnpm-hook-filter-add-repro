import fs from 'node:fs'
import path from 'node:path'

// Restrict pnpm to the workspace projects present on disk (e.g. in a git sparse checkout).
export const hooks = {
  updateConfig (config) {
    if (config.filter?.length) return config
    const root = import.meta.dirname
    const onDisk = fs.readdirSync(path.join(root, 'packages'))
      .filter((name) => fs.existsSync(path.join(root, 'packages', name, 'package.json')))
      .map((name) => `./packages/${name}`)
    return { ...config, filter: onDisk }
  },
}
