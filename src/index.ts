
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import through = require('through2')
import File = require('vinyl')
import { replaceExtension } from 'gulp-util'
import pdflatex from 'node-pdflatex'

type Options = {
  shellEscape?: boolean,
  texInputs?: string[]
}

const gulpPdflatex = (options: Options): NodeJS.ReadableStream =>
  through.obj((file: File, encoding, next) => {

    if (file.isStream()) {
      // Set output file extension to PDF
      file.extname = '.pdf'
      file.path = replaceExtension(file.path, file.extname)
      file.contents = pdflatex(
        file.contents,
        {
          cwd: file.dirname,
          texInputs: options.texInputs,
          shellEscape: options.shellEscape
        }
      )
    }

    next(null, file)
  })

export = gulpPdflatex
