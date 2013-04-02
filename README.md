Rename
======
Batch rename files. 

Usage
-----
Both `--find` and `--replace` accept regular expressions.

```sh
$ rename [--dry-run|-d] --find|-f <find regex> [--replace|-r <replace regex>] <files>
```
Examples
--------
Strip out unwanted prefixes:

```sh
$ rename -f "Season 1 - " *
```

Reformat filenames: 

```sh
$ tree
.
├── file1.test
├── file2.test
├── file3.test
├── file4.test
└── file5.test
$ rename -f "file(\d)" -r "File \$1" *
$ tree
.
├── File 1.test
├── File 2.test
├── File 3.test
├── File 4.test
└── File 5.test
```