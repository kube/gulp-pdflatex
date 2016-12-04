
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
import File = require('vinyl')
import pdflatex from 'node-pdflatex'

type Options = {
  shellEscape?: boolean,
  texInputs?: string[]
}

const replaceExtension = (path: any, ext: string) =>
  typeof path === 'string' ?
    join(dirname(path), basename(path, extname(path)) + ext) : path

const gulpPdflatex = (options: Options): NodeJS.ReadableStream =>
  through.obj((file: File, encoding, next) => {

    if (file.isStream()) {
      // Set output file extension to PDF
      file.extname = '.pdf'
      file.path = replaceExtension(file.path, file.extname)
      file.contents = pdflatex(
        file.contents,
        {
          shellEscape: options.shellEscape,
          texInputs: [file.base, ...options.texInputs],
        }
      )
    }
    next(null, file)
  })

export = gulpPdflatex
