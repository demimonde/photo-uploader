import { m1, m2 } from './m.js'

export let e = m1

let i = 0

window.b = async () => {
  i++
  // ?t=${Math.random()}
  const { m1: mm1, m2: mm2 } = await import(`./m.js`)
  debugger
  console.log(mm1 === m1)
  if (i % 2) {
    console.log('setting m2')
    e = mm2
  } else {
    console.log('setting m1')
    e = mm1
  }
}