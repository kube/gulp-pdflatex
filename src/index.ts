
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { join, resolve, dirname, basename, extname } from 'path'
import through = require('through2')
import getRawBody = require('raw-body')
import { Readable } from 'stream'
import File = require('vinyl')
import pdflatex from 'node-pdflatex'

type Options = {
  shellEscape?: boolean,
  texInputs?: string[]
}

const replaceExtension = (path: any, ext: string) =>
  typeof path === 'string' ?
    join(dirname(path), basename(path, extname(path)) + ext) : path

const gulpPdflatex = (options: Options): NodeJS.ReadWriteStream =>
  through.obj((file: File, encoding: string, next: Function) => {

    if (file.isStream()) {
      // Set output file extension to PDF
      file.extname = '.pdf'
      file.path = replaceExtension(file.path, file.extname)

      // Get output PDF stream
      const output = pdflatex(file.contents, {
        shellEscape: options.shellEscape,
        texInputs: [file.base, ...options.texInputs],
      })

      file.contents = output
      next(null, file)
    }

    else if (file.isBuffer()) {
      // Set output file extension to PDF
      file.extname = '.pdf'
      file.path = replaceExtension(file.path, file.extname)

      // Create input stream from buffer
      const input = through()
      input.end(file.contents)

      // Get output PDF stream from input
      const output = pdflatex(input, {
        shellEscape: options.shellEscape,
        texInputs: [file.base, ...options.texInputs],
      })

      // Convert output PDF Stream to Buffer
      getRawBody(output as Readable)
        .then(data => (file.contents = data as Buffer) && next(null, file))
        .catch(err => next(err))
    }
    else
      // Return file without modifications
      next(null, file)
  })

export = gulpPdflatex
