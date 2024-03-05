import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListItem = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      render (text, record) {
        return (
          <div>
            <div>{record.productCode} - {record.productName}</div>
          </div>
        )
      }
    },
    {
      title: (<strong>Qty</strong>),
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        pagination={false}
        bordered
        columns={columns}
        simple
        size="small"
        scroll={{ x: 1000 }}
        rowKey={record => record.no}
      />
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListItem
