[![view on npm](http://img.shields.io/npm/v/renamer/next.svg)](https://www.npmjs.org/package/renamer)
[![npm module downloads](http://img.shields.io/npm/dt/renamer.svg)](https://www.npmjs.org/package/renamer)
[![Build Status](https://travis-ci.org/75lb/renamer.svg?branch=next)](https://travis-ci.org/75lb/renamer?branch=next)
[![Coverage Status](https://coveralls.io/repos/github/75lb/renamer/badge.svg?branch=next)](https://coveralls.io/github/75lb/renamer?branch=next)
[![Dependency Status](https://david-dm.org/75lb/renamer.svg)](https://david-dm.org/75lb/renamer)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

***renamer v1.0.0 and this documentation is a WIP***

# renamer
Renamer is a command-line utility to help rename files and folders in bulk. It is flexible and extensible via plugins.

## Disclaimer

Always run this tool with the `--dry-run` option until you are confident the results look correct.

## Synopsis

As input, renamer takes a list of filenames or glob patterns plus some options describing how you would like the files to be renamed. If no filesnames/patterns are specified, renamer will look for a newline-separated list of filenames on standard input.

<pre><code>$ renamer [options] [<u>file</u> <u>...</u>]
</pre></code>

Trivial example. It will replace the text `jpeg` with `jpg` in all file or folder names in the current directory.

```
$ renamer --find jpeg --replace jpg *
```

As above but operates on all files and folders recursively.

```
$ renamer --find jpeg --replace jpg "**"
```

Same operation but on a filename list supplied via stdin. This approach is useful for crafting a more specific input list using tools like `find`. This example operates on files modified less than 20 minutes ago.

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

Simple example using a [regular expression literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). The case-insensitive pattern `/one/i` matches the input file `ONE.jpg`, renaming it to `two.jpg`.

```
$ renamer --find '/one/i' --replace 'two' ONE.jpg
```

The full set of command-line options.

```
-f, --find string      Optional find string (e.g. "one") or regular expression literal (e.g.
                       "/one/i"). If omitted, the whole filename will be matched and replaced.
-r, --replace string   The replace string. If omitted, defaults to a empty string. The special token
                       '{{index}}' will insert a number, incremented each time a file is replaced.
-d, --dry-run          Used for test runs. Set this to do everything but rename the file.
--force                If the target path already exists, overwrite it. Use with caution.
--view string          The default view outputs one line per rename. Set `--view detail` to see more
                       info including a diff.
-v, --verbose          In the output, also include names of files that were not renamed.
-h, --help             Print usage instructions.
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
$ npm install -g renamer@next
```

* * *

&copy; 2012-18 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
