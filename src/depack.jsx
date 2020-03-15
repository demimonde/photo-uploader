import { render } from 'preact'
import '../types/externs'
import PhotoUploader from '../build/'

render(<PhotoUploader />, window['container'])