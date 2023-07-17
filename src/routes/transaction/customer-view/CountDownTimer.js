import React from 'react'

class CountdownTimer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: this.props.duration
    }
  }

  componentDidMount () {
    this.countdown = setInterval(() => {
      this.setState(prevState => ({
        timer: prevState.timer - 1
      }))
    }, 1000)
  }

  componentDidUpdate () {
    if (this.state.timer <= 0) {
      clearInterval(this.countdown)
      this.props.onTimerFinish()
    }
  }

  componentWillUnmount () {
    clearInterval(this.countdown)
  }

  render () {
    const { timer } = this.state
    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

    return <div style={{ fontSize: '20px' }}>{`${formattedMinutes}:${formattedSeconds}`}</div>
  }
}

export default CountdownTimer
