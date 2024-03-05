import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListItem = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '18px'
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '200px',
      render (text, record) {
        return (
          <div>
            <div>{record.productCode} - {record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Desc',
      dataIndex: 'description',
      key: 'description',
      width: '200px'
    },
    {
      title: (<strong>Qty</strong>),
      dataIndex: 'qty',
      key: 'qty',
      width: '50px',
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
