import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'
import styles from '../../../../themes/index.less'

const numberFormatter = numberFormat.numberFormatter

const List = ({ editList, ...tableProps }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      className: styles.alignCenter,
      width: '100px'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: (text, record) => {
        return (
          <div>
            <div>{record.status}</div>
            <div>Input By: {record.user.employeeName}</div>
            <div>{moment(record.createdAt).format('HH:mm:ss')}</div>
          </div>
        )
      }
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px',
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.productCode}</strong></div>
            <div>{record.productName}</div>
          </div>
        )
      }
    },
    // {
    //   title: 'Stock Live',
    //   dataIndex: 'qtyLive',
    //   key: 'qtyLive',
    //   className: styles.alignCenter,
    //   width: '100px',
    //   render: text => numberFormatter(text || 0)
    // },
    {
      title: 'Input',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignCenter,
      width: '100px',
      render: text => numberFormatter(text || 0)
    },
    {
      title: 'Selisih',
      dataIndex: 'qtyDiff',
      key: 'qtyDiff',
      className: styles.alignCenter,
      width: '100px',
      render: text => numberFormatter(text || 0)
    },
    {
      title: 'Biaya',
      dataIndex: 'value',
      key: 'value',
      className: styles.alignCenter,
      width: '100px',
      render: (text, record) => numberFormatter(record.qtyDiff * record.product.costPrice)
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500 }}
        columns={columns}
        simple
        rowClassName={(record) => {
          if (record.status === 'DIFF' || record.status === 'CONFLICT' || record.status === 'MISS') {
            if (record.qtyDiff <= 0) {
              return 'table-row-danger'
            }
            return 'table-row-dark'
          }
        }}
        rowKey={record => record.id}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
