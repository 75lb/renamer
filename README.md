[![view on npm](http://img.shields.io/npm/v/renamer.svg)](https://www.npmjs.org/package/renamer)
[![npm module downloads](http://img.shields.io/npm/dt/renamer.svg)](https://www.npmjs.org/package/renamer)
[![Build Status](https://travis-ci.org/75lb/renamer.svg?branch=master)](https://travis-ci.org/75lb/renamer)
[![Dependency Status](https://david-dm.org/75lb/renamer.svg)](https://david-dm.org/75lb/renamer)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# renamer
Rename files in bulk. Renamer is a command-line tool intended to introduce naming systems to collections of related files. It is flexible and extensible via plugins.

## Disclaimer

Always run this tool with the `--dry-run` option until you are 100% certain the result will be exactly what you expect.

## Synopsis

Syntax forms.

```
$ renamer [options] <files>
$ cat filenames.txt | renamer [options]
```

Trivial example. It will replace the text `jpeg` with `jpg` in all files or folders in the current directory.

```
$ renamer --find jpeg --replace jpg *
```

As above but operates on all files and folders recursively.

```
$ renamer --find jpeg --replace jpg "**"
```

Same operation but on a filename list supplied via stdin. This approach is useful for supplying specific file lists crafted by hand or using tools like `find`. This example operates on files modified less than 20 minutes ago.

```
$ find . -mtime -20m | renamer --find jpeg --replace jpg
```

The full set of command-line options.

```
  -f, --find string        Optional find string (or regular expression when --regexp is set). If not
                           set, the whole filename will be replaced.
  -r, --replace string     The replace string. With --regexp set, --replace can reference parenthesised
                           substrings from --find with $1, $2, $3 etc. If omitted, defaults to a blank
                           string. The special token '{{index}}' will insert an incrementing number per
                           file processed.
  -e, --regexp             When set, --find is intepreted as a regular expression.
  -d, --dry-run            Used for test runs. Set this to do everything but rename the file.
  -i, --insensitive        Enable case-insensitive finds.
  --force                  If the target path already exists, overwrite it. Use with caution.
  -p, --plugin module-id   Replacer function to use
  -v, --verbose            Use to print additional information.
  -h, --help               Print usage instructions.
```

For more information on Regular Expressions, see [this useful guide](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions).

## Globbing

Renamer comes with globbing support built in supporting all special characters [described here](https://github.com/isaacs/node-glob#glob-primer).

For example, this command operates on all `js` files in the current directory:

```
$ renamer --find this --replace that '*.js'
```

This command operates on all `js` files, recursively:

```
$ renamer --find this --replace that '**/*.js'
```

this command operates on all `js` files from the `lib` directory downward:

```
$ renamer --find this --replace that 'lib/**/*.js'
```

**Bash users without globstar will need to enclose the glob expression in quotes to prevent native file expansion**, i.e. `'**/*.js'`

## Further reading

Please see [the wiki](https://github.com/75lb/renamer/wiki) for more documentation and examples.

## Install

```
$ npm install -g renamer
```

* * *

&copy; 2012-18 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
