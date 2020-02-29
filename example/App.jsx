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
const a = render(app, window['preact-app'])

/* IDIO HOT RELOAD */
window['idioAddHotReload'] && window['idioAddHotReload'](() => {
  render(app, document.body, a)
})