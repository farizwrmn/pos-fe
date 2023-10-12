import React from 'react'
import { Card } from 'antd'
import { currencyFormatter } from 'utils/string'

const Item = ({
  item
}) => {
  const gridStyle = {
    width: '25%',
    textAlign: 'center'
  }

  return (
    <div>
      <Card.Grid style={gridStyle}>
        <div>{item && item.paymentOption && `${item.paymentOption.typeName}`}</div>
        <div>{currencyFormatter(item.balanceIn)}</div>
      </Card.Grid>
    </div>
  )
}

export default Item
