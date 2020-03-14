/* eslint-env browser */
import { render, Component } from 'preact'
import PhotoUploader from '../src'
import 'preact/devtools/'

class App extends Component {
  render() {
    return (
      <div container>
        Hello World
        <PhotoUploader uploadUri="/form" />
      </div>)
  }
}

const app = <App />
let a = render(app, window['preact-app'])

/* IDIO HOT RELOAD */
import hotReload from '@idio/hot-reload'
hotReload(() => {
  a = render(app, document.body, a)
})