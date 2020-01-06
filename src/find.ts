import * as util from 'util'
import * as path from 'path'
import * as fs from 'fs'

const readdir = util.promisify(fs.readdir)

export async function findWrapperJars(baseDir: string): Promise<string[]> {
  const files = await recursivelyListFiles(baseDir)
  return files
    .filter(file => file.endsWith('gradle-wrapper.jar'))
    .map(wrapperJar => path.relative(baseDir, wrapperJar))
}

async function recursivelyListFiles(baseDir: string): Promise<string[]> {
  const childrenNames = await readdir(baseDir)
  const childrenPaths = await Promise.all(
    childrenNames.map(async childName => {
      const childPath = path.resolve(baseDir, childName)
      return fs.lstatSync(childPath).isDirectory()
        ? recursivelyListFiles(childPath)
        : new Promise(resolve => resolve([childPath]))
    })
  )
  return Array.prototype.concat(...childrenPaths)
}