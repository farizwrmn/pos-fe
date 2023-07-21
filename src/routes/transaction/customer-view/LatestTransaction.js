import { Tag } from 'antd'
import { lstorage } from 'utils'
import React from 'react'

class LatestTransaction extends React.Component {
  state = {
    timeout: null
  }

  componentDidMount () {
    const { onTimeOut } = this.props
    const millisecond = 1000
    const second = 60
    const minute = lstorage.getCustomerViewLastTransactionTimeLimit() || 5
    const totalTime = Number(minute) * second * millisecond
    let timeout = setTimeout(onTimeOut, totalTime)
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      timeout
    })
  }

  componentWillUnmount () {
    const { timeout } = this.state
    clearTimeout(timeout)
  }

  render () {
    const { dynamicQrisLatestTransaction } = this.props
    return <Tag color="green" style={{ width: '100%' }}>{dynamicQrisLatestTransaction}</Tag>
  }
}

export default LatestTransaction
