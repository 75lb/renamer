rename
======
Batch rename filenames.

Install
-------
```sh
$ npm install -g rename
```
*Linux/Mac users may need to run the above with `sudo`*

Usage
-----
```sh
$ rename [--find <pattern>] [--replace <string>] [--dry-run] [--regex] <files>

-f, --find      The find string, or regular expression when --regex is set. 
                If not set, the whole filename will be replaced.
-r, --replace   The replace string. With --regex, --replace can reference parenthesised substrings 
                from --find with $1, $2, $3 etc. If omitted, defaults to a blank string.
                The special token '{{index}}' will insert an incrementing number per file processed.
-e, --regex     When set, --find is intepreted as a regular expression. 
-d, --dry-run   Used for test runs. When set, rename does everything but rename the file.
```

 

Examples
--------
_Simple replace_

```sh
$ tree -N
.
├── A poem [bad].txt
├── A story [bad].txt

$ rename --find [bad] --replace [good] *

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

$ rename --find 'Season 1 - ' *

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

$ rename --regex --find '.*_(\d+)_.*' --replace 'Video $1.mp4' *

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

$ rename --replace Image{{index}}.jpg *

$ tree
.
├── Image1.jpg
├── Image2.jpg
├── Image3.jpg
```
