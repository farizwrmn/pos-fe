import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import { numberFormatter } from 'utils/string'
import styles from '../../../../themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 200
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: 200
    },
    {
      title: 'In',
      dataIndex: 'adjInQty',
      key: 'adjInQty',
      width: 120,
      className: styles.alignCenter,
      render: text => numberFormatter(text || 0)
    },
    {
      title: 'Out',
      dataIndex: 'adjOutQty',
      key: 'adjOutQty',
      width: 120,
      className: styles.alignCenter,
      render: text => numberFormatter(text || 0)
    },
    {
      title: 'Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: 120,
      className: styles.alignCenter,
      render: text => formatNumberIndonesia(text || 0)
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      className: styles.alignRight,
      render: (text, record) => {
        if (record.adjOutQty > 0) {
          return formatNumberIndonesia(record.adjOutQty * record.sellingPrice || 0)
        }
        if (record.adjInQty > 0) {
          return formatNumberIndonesia(record.adjInQty * record.sellingPrice || 0)
        }
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        pagination={false}
        simple
        rowKey={record => record.no}
        title={() => {
          const total = tableProps.dataSource.reduce((prev, next) => prev + (next.adjInQty > 0 ? next.adjInQty * next.sellingPrice : next.adjOutQty * next.sellingPrice), 0)
          return (
            <div>
              <strong>{`Total: ${formatNumberIndonesia(total)}`}</strong>
            </div>
          )
        }}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
