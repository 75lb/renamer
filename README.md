[![view on npm](http://img.shields.io/npm/v/renamer.svg)](https://www.npmjs.org/package/renamer)
[![npm module downloads](http://img.shields.io/npm/dt/renamer.svg)](https://www.npmjs.org/package/renamer)
[![Build Status](https://travis-ci.org/75lb/renamer.svg?branch=master)](https://travis-ci.org/75lb/renamer)
[![Dependency Status](https://david-dm.org/75lb/renamer.svg)](https://david-dm.org/75lb/renamer)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# renamer
Rename files in bulk. Renamer is a command-line tool intended to introduce naming systems to collections of related files. It is flexible and extensible via plugins.

## Disclaimer

Always run this tool with the `--dry-run` option until you are 100% certain the results will be correct.

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

**Don't forget to test your rename operation first using `--dry-run`!**

Recursing
---------
Renamer comes with globbing support built in (provided by [node-glob](https://github.com/isaacs/node-glob), enabling recursive operations. To recurse, use the `**` wildcard where a directory name would appear to apply the meaning "any directory, including this one".

For example, this command operates on all `js` files in the current directory:

    $ renamer --find this --replace that '*.js'

this command operates on all `js` files, recursively:

    $ renamer --find this --replace that '**/*.js'

this command operates on all `js` files from the `lib` directory downward:

    $ renamer --find this --replace that 'lib/**/*.js'

**Bash users without globstar will need to enclose the glob expression in quotes to prevent native file expansion**, i.e. `'**/*.js'`

Examples
--------
Some real-world examples.

**Windows users**: the single-quotation marks used in the example commands below are for bash (Mac/Linux) users, please replace these with double-quotation marks on Windows.

### Simple replace

```
$ renamer --find '[bad]' --replace '[good]' *
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── A poem [bad].txt
├── A story [bad].txt</code></pre></td>
            <td><pre><code>.
├── A poem [good].txt
├── A story [good].txt</code></pre></td>
        </tr>
    </tbody>
</table>

### Case insenstive finds

```
$ renamer --insensitive --find 'mpeg4' --replace 'mp4' *
```
<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── A video.MPEG4
├── Another video.Mpeg4</code></pre></td>
            <td><pre><code>.
├── A video.mp4
├── Another video.mp4</code></pre></td>
        </tr>
    </tbody>
</table>

### Strip out unwanted text

If omitted, `--replace` defaults to an empty string.

```
$ renamer --find 'Season 1 - ' *
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── Season 1 - A boring episode.mp4
├── Season 1 - Not boring episode.mp4</code></pre></td>
            <td><pre><code>.
├── A boring episode.mp4
├── Not boring episode.mp4</code></pre></td>
        </tr>
    </tbody>
</table>

### Simple filename cleanup

This example uses `--regexp` to enable pattern matching. The value passed to `--find` will be interpreted as a [Javascript regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

```
$ renamer --regexp --find '.*_(\d+)_.*' --replace 'Video $1.mp4' *
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── [ag]_Annoying_filename_-_3_[38881CD1].mp4
├── [ag]_Annoying_filename_-_34_[38881CD1].mp4
├── [ag]_Annoying_filename_-_53_[38881CD1].mp4</code></pre></td>
            <td><pre><code>.
├── Video 3.mp4
├── Video 34.mp4
├── Video 53.mp4</code></pre></td>
        </tr>
    </tbody>
</table>

### Give your images a new numbering scheme

The special `{{index}}` token in the `--replace` string will be replaced with the position of the file in the input file list.

```
$ renamer --replace 'Image{{index}}.jpg' *
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── IMG_5776.JPG
├── IMG_5777.JPG
├── IMG_5778.JPG</code></pre></td>
            <td><pre><code>.
├── Image1.jpg
├── Image2.jpg
├── Image3.jpg</code></pre></td>
        </tr>
    </tbody>
</table>

### do something about all those full stops

```
$ renamer --regexp --find '\.(?!\w+$)' --replace ' ' *
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── loads.of.full.stops.every.where.jpeg
├── loads.of.full.stops.every.where.mp4</code></pre></td>
            <td><pre><code>.
├── loads of full stops every where.jpeg
├── loads of full stops every where.mp4</code></pre></td>
        </tr>
    </tbody>
</table>

### if not already done, add your name to a load of files
```
$ renamer --regexp --find '(data\d)(\.\w+)' --replace '$1 (checked by Lloyd)$2' *
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── data1.csv
├── data2 (checked by Lloyd).csv
├── data3.xls</code></pre></td>
            <td><pre><code>.
├── data1 (checked by Lloyd).csv
├── data2 (checked by Lloyd).csv
├── data3 (checked by Lloyd).xls</code></pre></td>
        </tr>
    </tbody>
</table>


### rename files and folders, recursively

```
$ renamer --find 'pic' --replace 'photo' '**'
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── pic1.jpg
├── pic2.jpg
└── pics
    ├── pic3.jpg
    └── pic4.jpg
</code></pre></td>
            <td><pre><code>.
├── photo1.jpg
├── photo2.jpg
└── photos
    ├── photo3.jpg
    └── photo4.jpg</code></pre></td>
        </tr>
    </tbody>
</table>

### prefix files and folders, recursively

```
$ renamer --regexp --find '^' --replace 'good-' '**'
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── pic1.jpg
├── pic2.jpg
└── pics
    ├── pic3.jpg
    └── pic4.jpg
</code></pre></td>
            <td><pre><code>.
├── good-pic1.jpg
├── good-pic2.jpg
└── good-pics
    ├── good-pic3.jpg
    └── good-pic4.jpg</code></pre></td>
        </tr>
    </tbody>
</table>

Install
-------
Install [node](https://nodejs.org) then:
```
$ npm install -g renamer
```

* * *

&copy; 2012-18 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
