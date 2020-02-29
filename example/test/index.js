import { e } from './t.js'

window.test = () => {
  console.log(e)
  if (typeof e == 'function') {
    console.log(e())
  }
}

test()