import { connect } from 'dva'
import React from 'react'

class RequestCancelPos extends React.Component {
  render () {
    const {
      requestCancelPos
    } = this.props

    console.log('requestCancelPos', requestCancelPos)

    return (
      <div className="content-inner">
        Testing
      </div>
    )
  }
}

export default connect(({
  requestCancelPos
}) => ({
  requestCancelPos
}))(RequestCancelPos)
