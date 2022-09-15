import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const List = ({ editList, ...tableProps }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '100px'
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px',
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.productCode}</strong> - {record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Stock Awal',
      dataIndex: 'qtyAwal',
      key: 'qtyAwal',
      width: '100px',
      render: text => formatNumberIndonesia(text || 0)
    },
    {
      title: 'Input',
      dataIndex: 'qty',
      key: 'qty',
      width: '100px',
      render: text => formatNumberIndonesia(text || 0)
    },
    {
      title: 'Penjualan',
      dataIndex: 'qtySales',
      key: 'qtySales',
      width: '100px',
      render: text => formatNumberIndonesia(text || 0)
    },
    {
      title: 'Selisih',
      dataIndex: 'diff',
      key: 'diff',
      width: '100px',
      render: text => formatNumberIndonesia(text || 0)
    },
    {
      title: 'Input Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '150px',
      render: text => (text ? moment(text).format('HH:mm:ss') : '')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '150px',
      render: text => (text ? moment(text).format('HH:mm:ss') : '')
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
