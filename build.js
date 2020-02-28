import { writeFileSync } from 'fs'
import { compileStylesheetsSync } from 'closure-stylesheets'
import path from 'closure-stylesheets-java'

const { renameMap, stylesheet, status, stderr } = compileStylesheetsSync([
  'src/styles/style.css',
  'src/styles/image.css',
  'src/styles/photo.css',
], {
  path,
  cssRenamingPrefix: 'pu-',
  rootSelector: '.PhotoUploader',
  whitelist: ['PhotoUploader'],
})

if (status) {
  console.log(stderr)
} else {
  console.log(stylesheet)
  console.log(renameMap)
  writeFileSync('src/styles/closure.css', stylesheet)
  writeFileSync('src/styles/closure.json', JSON.stringify(renameMap, null, 2))
}