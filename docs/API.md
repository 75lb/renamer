## renamer

Rename files in bulk.

* [renamer](#module_renamer)
    * [Renamer](#exp_module_renamer--Renamer)
        * [.rename(options)](#module_renamer--Renamer+rename)
        * [.results(options)](#asdf)
        * ReplaceResult

### Renamer

**Kind**: Exported class

#### [async] renamer.rename(options):`Array<ReplaceResult>`

An asynchronous method to rename files in bulk.

**Kind**: Async instance method of [`Renamer`](#exp_module_renamer--Renamer)

#### [async] renamer.results(options):`iterator`

An asynchronous generator function for iterating through the process one rename at a time. Each iteration yields a `ReplaceResult` object.

#### Type: ReplaceResult

Contains information about the completed replace.

**Kind**: Internal type  
**Properties:**

| Name | Type | Description |
| --- | --- | --- |
| from | `string` | The filename before rename. |
| to | `string` | The filename after rename. |
| renamed | `boolean` | True if the file was renamed. |

#### Type: RenamerOptions

**Kind**: Internal type  
**Properties:**

| Param | Type | Description |
| --- | --- | --- |
| options | `object` | The renamer options |
| [options.files] | `Array.<string>` | One or more glob patterns or filenames to process. |
| [options.dryRun] | `boolean` | Set this to do everything but rename the file. You should always set this flag until certain the output looks correct. |
| [options.force] | `boolean` | If a target path exists, renamer will stop. With this flag set the target path will be overwritten. The main use-case for this flag is to enable changing the case of files on case-insensitive systems. Use with caution. |
| [options.chain] | `Array.<string>` | One or more replace chain plugins to use, set the `--chain` option multiple times to build a chain. For each value, supply either: a) a path to a plugin file b) a path to an installed plugin package or c) the name of a built-in plugin, either `find-replace` or `index-replace`. The default plugin chain is `find-replace` then `index-replace`. |
| [options.find] | `sting` \| `RegExp` | Optional find string (e.g. `one`) or regular expression literal (e.g. `/one/i`). If omitted, the whole filename will be matched and replaced. |
| [options.replace] | `string` | The replace string. If omitted, defaults to a empty string. |
| [options.pathElement] | `string` | The path element to rename, valid values are `base` (the default), `name` and `ext`. For example, in the path `pics/image.jpg`, the base is `image.jpg`, the name is `image` and the ext is `.jpg`. |
| [options.indexFormat] | `string` | The format of the number to replace `{{index}}` with. Specify a standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`. |
| [options.indexRoot] | `string` | The initial value for `{{index}}`. Defaults to 1. |
