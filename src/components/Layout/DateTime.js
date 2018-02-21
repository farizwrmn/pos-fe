import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styles from './Layout.less'

class DateTime extends React.Component {
  constructor (props) {
    super(props)
    const { setDate, setDateDiff } = props
    this.state = {
      date: setDate ? new Date(setDate) : new Date(),
      setDateDiff,
      diffDate: setDateDiff || moment(new Date()).diff(moment(new Date(setDate)))
    }
  }
  componentDidMount () {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    )
  }
  componentWillUnmount () {
    clearInterval(this.timerID)
  }
  tick () {
    this.setState({
      date: moment(new Date(), 'DD/MM/YYYY HH:mm:ss').subtract(this.state.diffDate, 'milliseconds').toDate()
    })
  }
  render () {
    let diffColor
    if (this.state.setDateDiff > 500) {
      diffColor = { color: styles.colorred }
    } else {
      diffColor = { color: styles.colorblue }
    }
    return (<div style={diffColor}>{
      moment(this.state.date).format('DD-MMM-YYYY HH:mm:ss')
    }</div>)
  }
}

DateTime.propTypes = {
  setDate: PropTypes.string,
  setDateDiff: PropTypes.string
}

export default DateTime
