import React from 'react'
import { Card } from 'antd'
import Item from './Item'

class CurrentItem extends React.Component {
  render () {
    const {
      title,
      list
    } = this.props

    return (
      <div>
        <Card title={title}>
          <Item item={{ paymentOption: { typeName: 'TOTAL' }, balanceIn: list.reduce((prev, next) => prev + next.balanceIn, 0) }} />
        </Card>
      </div>
    )
  }
}

export default CurrentItem
