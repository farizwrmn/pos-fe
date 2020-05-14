import React, { Component } from 'react'
import { InputNumber } from 'antd'

class InputNumberFocus extends Component {
  // componentDidMount () {
  //   this.onFocus()
  // }

  // onFocus () {
  //   const { id } = this.props
  //   if (id === 'qty') {
  //     document.querySelector('qty').focus()
  //   }
  // }

  render () {
    const { ...props } = this.props
    return (
      <InputNumber {...props} onFocus={e => e.currentTarget.select()} />
    )
  }
}

export default InputNumberFocus
