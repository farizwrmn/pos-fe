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
    return [
      {
        name: 'Subtotal',
        value: data.subTotal
      },
      {
        name: 'Subtotal Food',
        value: data.totalFood
      },
      {
        name: 'Subtotal Non Food',
        value: data.totalNonFood
      },
      {
        name: 'Subtotal Dine In',
        value: data.totalDineIn
      },
      {
        name: 'Commission',
        value: data.commission
      },
      {
        name: 'Charge',
        value: data.charge
      },
      {
        name: 'Grab',
        value: data.grab
      },
      {
        name: 'Capital',
        value: data.capital
      },
      {
        name: 'Profit',
        value: data.profit
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
