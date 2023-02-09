import React from 'react'
import { Table } from 'antd'
import { numberFormat } from 'utils'

const numberFormatter = numberFormat.numberFormatter

const Summary = ({ ...tableProps, list }) => {
  const columns = [
    {
      title: (
        <div style={{ fontWeight: 'bolder', color: '#000000' }}>
          Summary
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      render: text => <div style={{ fontWeight: 'bolder', color: '#000000' }}>{text}</div>
    },
    {
      title: (
        <div style={{ fontWeight: 'bolder', color: '#000000' }}>
          Faktur Penjualan
        </div>
      ),
      dataIndex: 'value',
      key: 'value',
      render: value => <div style={{ textAlign: 'end' }}>Rp {numberFormatter(value)}</div>
    }
  ]

  const dataSummary = (data) => {
    let subTotal = 0
    let commission = 0
    let charge = 0
    let grab = 0
    let capital = 0
    let profit = 0
    for (let item in data) {
      const record = list[item]
      subTotal += record.total
      commission += record.commission
      charge += record.charge
      grab += record.commissionGrab
      capital += record['stock.product.capital'] * record.quantity
      profit += record.profit
    }
    return [
      {
        name: 'Subtotal',
        value: subTotal
      },
      {
        name: 'commission',
        value: commission
      },
      {
        name: 'charge',
        value: charge
      },
      {
        name: 'grab',
        value: grab
      },
      {
        name: 'capital',
        value: capital
      },
      {
        name: 'profit',
        value: profit
      }
    ]
  }

  return (
    <Table
      {...tableProps}
      bordered
      dataSource={dataSummary(list)}
      columns={columns}
      simple
      pagination={false}
      rowKey={record => record.id}
    />
  )
}

export default Summary
