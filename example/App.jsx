/* eslint-env browser */
import { render, Component } from 'preact'
import PhotoUploader from '../src'
// import 'preact/devtools/'

class Main extends Component {
  render() {
    return (
      <div className="container">
        Hello World
        <PhotoUploader uploadUri="/api" />
      </div>)
  }
}

render(<Main />, document.querySelector('#preact'))