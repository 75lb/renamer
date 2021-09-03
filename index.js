import renameFile from './lib/rename-file.js'
import ReplaceChain from './lib/replace-chain.js'
import FileSet from 'file-set'
import { depthFirstCompare } from './lib/util.js'

/** ∆ Renamer
≈ A tool to rename files and folders in bulk.
*/
class Renamer {
  /** ø renamer.rename(options):Array<ReplaceResult>
  ≈ A synchronous method to rename files in bulk.

  • [options]             :object
  • [options.files]       :Array<string>  - One or more glob patterns or filenames to process.
  • [options.dryRun]      :boolean        - Set this to do everything but rename the file. You should always
                                            set this flag until certain the output looks correct.
  • [options.force]       :boolean        - If a target path exists, renamer will stop. With this flag set
                                            the target path will be overwritten. The main use-case for this flag is to enable changing the case of files on case-insensitive systems. Use with caution.
  • [options.chain]       :string[]       - One or more replacer plugins to use, set the `--chain` option
                                            multiple times to build a chain. For each value, supply either: a) a path to a plugin file b) a path to a plugin package c) the name of a plugin package installed globally or in the current working directory (or above) or d) the name of a built-in plugin, either `default` or `index`. The default plugin chain is `default` then `index`, be sure to set `-p default -p index` before your plugin if you wish to extend default behaviour.
  • [options.find]        :string|RegExp  - Optional find string (e.g. `one`) or regular expression literal (
                                            e.g. `/one/i`). If omitted, the whole filename will be matched and replaced.
  • [options.replace]     :string         - The replace string. If omitted, defaults to a empty string.
  • [options.pathElement] :string         - The path element to rename, valid values are `base` (the
                                            default), `name` and `ext`. For example, in the path `pics/image.jpg`, the base is `image.jpg`, the name is `image` and the ext is `.jpg`.
  • [options.indexFormat] :string         - The format of the number to replace `{{index}}` with. Specify a
                                            standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`.
  • [options.indexRoot]   :string         - The initial value for `{{index}}`. Defaults to 1.

  † ReplaceResult
  • from :string     - The filename before rename,
  • to :string       - The filename after rename.
  • renamed :boolean - True if the file was renamed.
  */
  async rename (options = {}) {
    const results = []
    for await (const result of this.results(options)) {
      results.push(result)
    }
    return results
  }

  /** ø renamer.results(options):iterator
  ≈ Useful when you want process the renames one-by-one.
  ¥ ReplaceResult
  */
  async * results (options = {}) {
    const fileSet = new FileSet()
    await fileSet.add(options.files)
    if (fileSet.notExisting.length) {
      throw new Error(`These paths or patterns do not exist: ${fileSet.notExisting.join(', ')}`)
    }
    const replaceChain = new ReplaceChain()
    await replaceChain.loadPlugins(options.chain)
    const files = [...fileSet.files, ...fileSet.dirs.sort(depthFirstCompare)]
    const replaceResults = files
      .map((file, index) => replaceChain.replace(file, options, index, files))
    for (const replaceResult of replaceResults) {
      if (replaceResult.renamed) {
        await renameFile(replaceResult.from, replaceResult.to, { force: options.force, dryRun: options.dryRun })
      }
      yield replaceResult
    }
  }
}

export default Renamer
