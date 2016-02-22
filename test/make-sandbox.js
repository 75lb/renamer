#!/usr/bin/env node
'use strict'

var path = require('path')
var mfs = require('more-fs')

mfs.rmdir('sandbox')

;[1, 2, 3, 4, 5].forEach(function (number) {
  var fileName = path.join('sandbox', 'file' + number + '.test')
  mfs.write(fileName)
})
;[1, 2, 3, 4, 5].forEach(function (number) {
  var fileName = path.join('sandbox/folder', 'file' + number + '.test')
  mfs.write(fileName)
})

var someFiles = [
  'sandbox/[#f1ipping4nn0y1ing].file.NAME--23[$1$$!].mkv',
  'sandbox/[#f1ipping4nn0y1ing].file.NAME--3[$2$$!].mkv',
  'sandbox/[#f1ipping4nn0y1ing].file.NAME--13[$3$$!].mkv',
  'sandbox/[ag]_Annoying_filename_-_3_[38881CD1].mp4',
  'sandbox/[eg]_Annoying_filename_-_13_[38881CD2].mp4',
  'sandbox/[fg]_Annoying_filename_-_23_[38881CD3].mp4',
  'sandbox/loads.of.full.stops.every.where.mp4',
  'sandbox/youtube-dl-h5yIJXdItgo.mp4',
  "sandbox/blah don't blah -Mr Blah-tkxWmh-tFGs.avi",
  'sandbox/folder/[#f1ipping4nn0y1ing].file.NAME--23[$1$$!].mkv',
  'sandbox/folder/[#f1ipping4nn0y1ing].file.NAME--3[$2$$!].mkv',
  'sandbox/folder/[#f1ipping4nn0y1ing].file.NAME--13[$3$$!].mkv',
  'sandbox/folder/[ag]_Annoying_filename_-_3_[38881CD1].mp4',
  'sandbox/folder/[eg]_Annoying_filename_-_13_[38881CD2].mp4',
  'sandbox/folder/[fg]_Annoying_filename_-_23_[38881CD3].mp4',
  'sandbox/folder/loads.of.full.stops.every.where.mp4',
  'sandbox/folder/youtube-dl-h5yIJXdItgo.mp4',
  "sandbox/folder/blah don't blah - Mr Blah-tkxWmh-tFGs.avi"
]
someFiles.forEach(mfs.write)
