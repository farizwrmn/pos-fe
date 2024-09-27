import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
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
      width: 40
    },
    {
      title: 'Product Code',
      dataIndex: 'product.productCode',
      key: 'product.productCode',
      width: 100
    },
    {
      title: 'Product Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      width: 200
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 60,
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text || 0)
    },
    {
      title: 'Total',
      dataIndex: 'DPP',
      key: 'DPP',
      width: 120,
      className: styles.alignRight,
      render: (text, record) => {
        return record.DPP * record.qty
      }
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
