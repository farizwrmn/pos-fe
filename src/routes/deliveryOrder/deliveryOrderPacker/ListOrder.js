import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListOrder = ({ editItem, deleteItem, ...tableProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '80px',
      className: styles.productPos
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 'auto',
      className: styles.productPos,
      render: (text, record) => {
        return (
          <div>
            <div><b>{record.productCode}</b></div>
            <div>{record.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Request',
      dataIndex: 'qty',
      key: 'qty',
      width: '80px',
      className: styles.qtyPos
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
        simple
        locale={{
          emptyText: 'Your Transfer Out List'
        }}
        size="small"
        scroll={{ y: '370px' }}
        rowKey={record => record.time}
      />
    </div>
  )
}

ListOrder.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListOrder
