[![view on npm](http://img.shields.io/npm/v/renamer.svg)](https://www.npmjs.org/package/renamer)
[![npm module downloads](http://img.shields.io/npm/dt/renamer.svg)](https://www.npmjs.org/package/renamer)
[![Build Status](https://travis-ci.org/75lb/renamer.svg)](https://travis-ci.org/75lb/renamer)
[![Dependency Status](https://david-dm.org/75lb/renamer.svg)](https://david-dm.org/75lb/renamer)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

renamer
=======
Batch rename files and folders.

Install
-------
Install [node](http://nodejs.org) then:
```sh
$ npm install -g renamer
```
*Linux/Mac users may need to run the above with `sudo`*

Usage
-----
```
  renamer
  Batch rename files and folders.

  Usage
  $ renamer <options> <files>

  -f, --find <string>      The find string, or regular expression when --regex is set. If not set, the whole filename will be replaced.
  -r, --replace <string>   The replace string. With --regex set, --replace can reference parenthesised substrings from --find with $1, $2, $3
                           etc. If omitted, defaults to a blank string. The special token '{{index}}' will insert an incrementing number per
                           file processed.
  -e, --regex              When set, --find is intepreted as a regular expression.
  -d, --dry-run            Used for test runs. Set this to do everything but rename the file.
  -i, --insensitive        Enable case-insensitive finds.
  -v, --verbose            Use to print additional information.
  -h, --help               Print usage instructions.

  for more detailed instructions, visit https://github.com/75lb/renamer
```

For more information on Regular Expressions, see [this useful guide](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions).

**Don't forget to test your rename first using `--dry-run`!**

Recursing
---------
Renamer comes with globbing support built in (provided by [node-glob](https://github.com/isaacs/node-glob)), enabling recursive operations. To recurse, use the `**` wildcard where a directory name would appear to apply the meaning "any directory, including this one".

For example, this command operates on all js files in the current directory:

    $ renamer --find this --replace that '*.js'

this command operates on all js files, recursively:

    $ renamer --find this --replace that '**/*.js'

this command operates on all js files from the `lib` directory downward:

    $ renamer --find this --replace that 'lib/**/*.js'

**Bash users without globstar will need to enclose the glob expression in quotes to prevent native file expansion**, i.e. `'**/*.js'`

Examples
--------
Some real-world examples.

**Windows users**: the single-quotation marks used in the example commands below are for bash (Mac/Linux) users, please replace these with double-quotation marks on Windows.

### Simple replace

```sh
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

```sh
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

```sh
$ renamer --find 'Season 1 - ' *
```

<table>
    <thead>
        <tr><th>Before</th><th>After</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><pre><code>.
├── Season 1 - Some crappy episode.mp4
├── Season 1 - Load of bollocks.mp4</code></pre></td>
            <td><pre><code>.
├── Some crappy episode.mp4
├── Load of bollocks.mp4</code></pre></td>
        </tr>
    </tbody>
</table>

### Simple filename cleanup

```sh
$ renamer --regex --find '.*_(\d+)_.*' --replace 'Video $1.mp4' *
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

```sh
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

```sh
$ renamer --regex --find '\.(?!\w+$)' --replace ' ' *
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
```sh
$ renamer --regex --find '(data\d)(\.\w+)' --replace '$1 (checked by Lloyd)$2' *
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

```sh
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

```sh
$ renamer --regex --find '^' --replace 'good-' '**'
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

* * *

&copy; 2012-16 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
