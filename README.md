[![view on npm](https://badgen.net/npm/v/renamer)](https://www.npmjs.org/package/renamer)
[![npm module downloads](https://badgen.net/npm/dt/renamer)](https://www.npmjs.org/package/renamer)
[![Gihub repo dependents](https://badgen.net/github/dependents-repo/75lb/renamer)](https://github.com/75lb/renamer/network/dependents?dependent_type=REPOSITORY)
[![Gihub package dependents](https://badgen.net/github/dependents-pkg/75lb/renamer)](https://github.com/75lb/renamer/network/dependents?dependent_type=PACKAGE)
[![Node.js CI](https://github.com/75lb/renamer/actions/workflows/node.js.yml/badge.svg)](https://github.com/75lb/renamer/actions/workflows/node.js.yml)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

***Upgraders, please read the [release notes](https://github.com/75lb/renamer/releases). Please share feedback and improvement ideas [here](https://github.com/75lb/renamer/discussions).***

# renamer

Renamer is a command-line utility to help rename files and folders. It is flexible and extensible via plugins.

## Disclaimer

Always run this tool with the `--dry-run` option until you are confident the results look correct.

## Synopsis

_The examples below use double quotes to suit Windows users. MacOS & Linux users should use single quotes._


As input, renamer takes a list of filenames or glob patterns plus some options describing how you would like the files to be renamed.

```
$ renamer [options] [file...]
```

This trivial example will replace the text `jpeg` with `jpg` in all file and directory names in the current directory.

```
$ renamer --find jpeg --replace jpg *
```

As above but operates on all files and folders recursively.

```
$ renamer --find jpeg --replace jpg "**"
```

### Fine-tune which files to process

If no filenames or patterns are specified, renamer will look for a newline-separated list of filenames on standard input. This approach is useful for crafting a specific input list using tools like `find`. This example operates on files modified less than 20 minutes ago.

```
$ find . -mtime -20m | renamer --find jpeg --replace jpg
```

Same again but with a hand-rolled input of filenames and glob patterns. Create an input text file, e.g. `files.txt`:

```
house.jpeg
garden.jpeg
img/*
```

Then pipe it into renamer.

```
$ cat files.txt | renamer --find jpeg --replace jpg
```

### Rename using regular expressions

Simple example using a [regular expression literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). The case-insensitive pattern `/one/i` matches the input file `ONE.jpg`, renaming it to `two.jpg`.

```
$ renamer --find "/one/i" --replace "two" ONE.jpg
```

### Rename using JavaScript

For more complex renames, or if you just prefer using code, you can write a [replace function](https://github.com/75lb/renamer/wiki/How-to-write-a-replace-chain-plugin). Create a module exporting a class which defines a `replace` method. This trivial example appends the text `[DONE]` to each file name.

```js
import path from 'path'

class Suffix {
  replace (filePath) {
    const file = path.parse(filePath)
    const newName = file.name + ' [DONE]' + file.ext
    return path.join(file.dir, newName)
  }
}

export default Suffix
```

Save the above as `suffix.js` then process all files in the current directory using the above plugin as the replace chain.

```
$ renamer --dry-run --chain suffix.js *

Dry run

✔︎ pic1.jpg → pic1 [DONE].jpg
✔︎ pic2.jpg → pic2 [DONE].jpg

Rename complete: 2 of 6 files renamed.
```

## Views

The following gif demonstrates the default view (with and without `--verbose` mode), the built-in alternative views (`long`, `diff` and `one-line`) and a [custom view](https://github.com/75lb/renamer/tree/master/example/view).

<img src="https://i.imgur.com/7830Y9N.gif" width="620px" title="Renamer views demo">

## Further reading

Please see [the wiki](https://github.com/75lb/renamer/wiki) for

* [Usage examples](https://github.com/75lb/renamer/wiki/examples).
*  More information about [using plugins](https://github.com/75lb/renamer/wiki/How-to-use-replace-chain-plugins) and [writing plugins](https://github.com/75lb/renamer/wiki/How-to-write-a-replace-chain-plugin).
* The [full list of command-line options](https://github.com/75lb/renamer/wiki/Renamer-CLI-docs).

For more information on Regular Expressions, see [this useful guide](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions).

## Install

First, ensure [Node.js](https://nodejs.org/en/) v14 or above is installed.

To install renamer globally as a part of your regular command-line tool kit:

```
$ npm install --global renamer
```

To install renamer as a development dependency of your project: 

```
$ npm install --save-dev renamer
```

* * *

&copy; 2012-24 Lloyd Brookes \<75pound@gmail.com\>.

Tested by [test-runner](https://github.com/test-runner-js/test-runner).
