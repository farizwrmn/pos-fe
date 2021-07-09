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
          {list && list.filter(filtered => filtered.balanceIn > 0).map(item => <Item item={item} />)}
        </Card>
      </div>
    )
  }
}

export default CurrentItem
