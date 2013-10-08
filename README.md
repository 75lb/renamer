[![Build Status](https://travis-ci.org/75lb/renamer.png)](https://travis-ci.org/75lb/renamer)
[![NPM version](https://badge.fury.io/js/renamer.png)](http://badge.fury.io/js/renamer)
renamer
=======
Batch rename files.

Install
-------
Install [node](http://nodejs.org) then:
```sh
$ npm install -g renamer
```
*Linux/Mac users may need to run the above with `sudo`*

Usage
-----
```sh
$ renamer [--regex] [--find <pattern>] [--replace <string>] [--dry-run] <files>
```
```
-f, --find      The find string, or regular expression when --regex is set. 
                If not set, the whole filename will be replaced.
-r, --replace   The replace string. With --regex set, --replace can reference
                parenthesised substrings from --find with $1, $2, $3 etc. 
                If omitted, defaults to a blank string. The special token 
                '{{index}}' will insert an incrementing number per file 
                processed.
-e, --regex     When set, --find is intepreted as a regular expression. 
-d, --dry-run   Used for test runs. Set this to do everything but rename the file.
-h, --help      Print usage instructions. 
```

For more information on Regular Expressions, see [this useful guide](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions). 

**Don't forget to test your rename first using `--dry-run`!**

Globbing
--------
Renamer comes with globbing support built in (provided by [node-glob](https://github.com/isaacs/node-glob)). If you want to override your shell's native [expansion](http://www.gnu.org/software/bash/manual/bashref.html#Shell-Expansions) behaviour (say, for example it lacks the [globstar](http://www.linuxjournal.com/content/globstar-new-bash-globbing-option) option), pass the glob expression in single quotes and renamer will expand it. For example, this command operates on all js files, recursively: 

    $ renamer -f 'this' -r 'that' '**/*.js'
 
Examples
--------
_Simple replace_

```sh
$ tree -N
.
├── A poem [bad].txt
├── A story [bad].txt

$ renamer --find '[bad]' --replace '[good]' *

$ tree -N
.
├── A poem [good].txt
├── A story [good].txt
```

_Strip out unwanted text_:

```sh
$ tree -N
.
├── Season 1 - Some crappy episode.mp4
├── Season 1 - Load of bollocks.mp4

$ renamer --find 'Season 1 - ' *

$ tree -N
.
├── Some crappy episode.mp4
├── Load of bollocks.mp4
```

_Simple filename cleanup_: 

```sh
$ tree
.
├── [ag]_Annoying_filename_-_3_[38881CD1].mp4
├── [ag]_Annoying_filename_-_34_[38881CD1].mp4
├── [ag]_Annoying_filename_-_53_[38881CD1].mp4

$ renamer --regex --find '.*_(\d+)_.*' --replace 'Video $1.mp4' *

$ tree
.
├── Video 3.mp4
├── Video 34.mp4
├── Video 53.mp4
```

_Give your images a new numbering scheme_:

```sh
$ tree
.
├── IMG_5776.JPG
├── IMG_5777.JPG
├── IMG_5778.JPG

$ renamer --replace 'Image{{index}}.jpg' *

$ tree
.
├── Image1.jpg
├── Image2.jpg
├── Image3.jpg
```

_do something about all those full stops_:

```sh
$ tree
.
├── loads.of.full.stops.every.where.jpeg
├── loads.of.full.stops.every.where.mp4

$ renamer --regex --find '\.(?!\w+$)' --replace ' ' *

$ tree
.
├── loads of full stops every where.jpeg
├── loads of full stops every where.mp4
```

_if not already done, add your name to a load of files_:

```sh
$ tree
.
├── data1.csv
├── data2 (checked by Lloyd).csv
├── data3.xls

$ renamer --regex --find '(data\d)(\.\w+)' --replace '$1 (checked by Lloyd)$2' *

$ tree
.
├── data1 (checked by Lloyd).csv
├── data2 (checked by Lloyd).csv
├── data3 (checked by Lloyd).xls
```
_rename files and folders, recursively_

```sh
$ tree
.
├── pic1.jpg
├── pic2.jpg
└── pics
    ├── pic3.jpg
    └── pic4.jpg

$ renamer --find 'pic' --replace 'photo' '**'

$ tree
.
├── photo1.jpg
├── photo2.jpg
└── photos
    ├── photo3.jpg
    └── photo4.jpg
```

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/75lb/renamer/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
