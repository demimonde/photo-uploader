import { h } from 'preact'
import { render } from 'preact'
import '../types/externs'
import PhotoUploader from './'

render( h(PhotoUploader), window['container'])