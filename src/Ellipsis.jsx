import { Component } from 'preact'

export default class Ellipsis extends Component {
  constructor() {
    super()
    this.state = {
      count: 3,
    }
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      let count = this.state.count + 1
      if (count > 3) count = 0
      this.setState({ count })
    }, 250)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    const t = '.'.repeat(this.state.count)
    const i = '.'.repeat(3-this.state.count)
    return <span>{t}<span style="opacity:0">{i}</span></span>
  }
}