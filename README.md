rename
======
Batch replace string or regular expression patterns in filenames. 

Install
-------
```sh
$ npm install -g rename
```

Usage
-----
```sh
$ rename [--dry-run|-d] [--find|-f <regex>] [--replace|-r <regex>] <files>
```

Both `--find` and `--replace` accept [javascript regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). `--find` defaults to the source filename, `--replace` to empty string. 

Use the special token `{{index}}` in your replace string to get an incrementing number per file processed. 

Examples
--------
_Strip out unwanted prefixes_:

```sh
$ tree -N
.
├── Season 1 - Some crappy episode.mp4
├── Season 1 - Load of bollocks.mp4

$ rename -f "Season 1 - " *

$ tree -N
.
├── Some crappy episode.mp4
├── Load of bollocks.mp4
```

_Reformat filenames_: 

```sh
$ tree
.
├── file1.test
├── file2.test
├── file3.test

$ rename -f "file(\d)" -r "File \$1" *

$ tree
.
├── File 1.test
├── File 2.test
├── File 3.test
```

_Give image filenames a new numbering scheme_:

```sh
$ tree
.
├── IMG_5776.JPG
├── IMG_5777.JPG
├── IMG_5778.JPG

$ rename -r Image{{index}}.jpg *

$ tree
.
├── Image1.jpg
├── Image2.jpg
├── Image3.jpg
```
