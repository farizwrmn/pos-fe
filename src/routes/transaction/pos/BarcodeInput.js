import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'

class BarcodeInput extends Component {
  state = {
    product: '',
    member: ''
  }

  render () {
    const { onEnter } = this.props
    return (
      <div>
        {/* <Input
          id="input-member"
          size="medium"
          style={{ fontSize: 24, marginTop: 5, marginBottom: 8 }}
          value={this.state.member}
          onChange={(event) => {
            this.setState({ member: event.target.value })
          }}
          placeholder="Member (CTRL+M)"
          onPressEnter={(event) => {
            onEnter(event, 'member')
            this.setState({ member: '' })
          }}
        /> */}
        <Input
          id="input-product"
          size="medium"
          autoFocus
          value={this.state.product}
          onChange={(event) => {
            this.setState({ product: event.target.value })
          }}
          style={{ fontSize: 24, marginBottom: 8 }}
          placeholder="Product (F2); ie. 2*Barcode"
          onPressEnter={(event) => {
            onEnter(event, 'barcode')
            this.setState({ product: '' })
          }}
        />
      </div>
    )
  }
}

BarcodeInput.propTypes = {
  onEnter: PropTypes.func.isRequired
}

export default BarcodeInput
