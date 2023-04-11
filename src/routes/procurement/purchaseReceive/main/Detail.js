import React from 'react'
import { Table } from 'antd'
import { Link } from 'dva/router'

const Detail = ({
  loading,
  ...otherProps
}) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '50px'
    },
    {
      title: 'Trans',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '130px',
      render: (text, record) => <Link to={`/transaction/procurement/receive/${record.id}`}>{text}</Link>
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '100px'
    },
    {
      title: 'Deadline',
      dataIndex: 'expectedArrival',
      key: 'expectedArrival',
      width: '100px'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '70px',
      // render: text => (text || '-').toLocaleString()
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{(text || '-').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: '140px',
      render: (text, record) => {
        return (
          <div>
            <div><b>Price: {(record.purchasePrice || '-').toLocaleString()}</b></div>
            <div>Discount: {(record.discount || '-').toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'TAX',
      dataIndex: 'DPP',
      key: 'DPP',
      width: '140px',
      render: (text, record) => {
        return (
          <div>
            <div><b>DPP: {(record.DPP || '-').toLocaleString()}</b></div>
            <div>PPN: {(record.PPN || '-').toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'Delivery',
      dataIndex: 'deliveryFee',
      key: 'deliveryFee',
      width: '140px',
      render: (text, record) => {
        return (
          <div>
            <div><b>Portion: {(parseFloat(record.portion || 0).toFixed(2) || '-').toLocaleString()}</b></div>
            <div><b>Delivery: {(Math.round(record.deliveryFee || 0) || '-').toLocaleString()}</b></div>
          </div>
        )
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '140px',
      render: (text) => {
        return (
          <div>
            <div><b>Total: {(text || '-').toLocaleString()}</b></div>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <div>
        <Table
          {...otherProps}
          pagination={false}
          loading={loading.effects['purchaseReceive/queryDetail']}
          bordered
          columns={columns}
          scroll={{ x: 1000 }}
          simple
          rowKey={record => record.id}
        />
      </div>
    </div>
  )
}

export default Detail
