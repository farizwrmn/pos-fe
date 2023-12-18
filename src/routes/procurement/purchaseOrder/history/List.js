import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { Link } from 'dva/router'

const List = (tableProps) => {
  const columns = [
    {
      title: 'Trans',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '130px',
      render: (text, record) => <Link target="_blank" to={`/transaction/procurement/order/${record.id}`}>{text}</Link>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: (text) => {
        if (text === 1) {
          return <Tag color="blue">On-Going</Tag>
        }
        if (text === 2) {
          return <Tag color="green">Finished</Tag>
        }
        if (text === 0) {
          return <Tag color="red">Cancelled</Tag>
        }
        return null
      }
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier.supplierName',
      key: 'supplier.supplierName',
      width: '100px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '100px'
    },
    {
      title: 'Time',
      dataIndex: 'transTime',
      key: 'transTime',
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
            <div><b>Delivery: {(Math.round(record.deliveryFee || 0) || '-').toLocaleString()}</b></div>
          </div>
        )
      }
    },
    {
      title: 'Total',
      dataIndex: 'netto',
      key: 'netto',
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
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
