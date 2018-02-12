import React from 'react'
import NumericInput from './InputNumber'

export default class NumericInputDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = { value: '' }
  }
  onChange = (value) => {
    this.setState({ value })
  }
  render () {
    return <NumericInput style={{ width: 120 }} value={this.state.value} onChange={this.onChange} />
  }
}
