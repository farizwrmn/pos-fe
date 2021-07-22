import React from 'react'
import { Card } from 'antd'
import { currencyFormatter } from 'utils/string'

const Item = ({
  item
}) => {
  const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: 100,
    textAlign: 'center'
  }

  return (
    <Card.Grid md={24} style={gridStyle}>
      <div>{item && item.paymentOption && `${item.paymentOption.typeName} (${item.paymentOption.typeCode})`}</div>
      <div>{currencyFormatter(item.balanceIn)}</div>
    </Card.Grid>
  )
}

export default Item
