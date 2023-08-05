import React from 'react'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const ListPayment = ({ ...tableProps }) => {
  // const handleRowClick = (record) => {
  //   onShowModalProduct()
  //   onSelectSticker(record)
  // }

  const columns = [
    { title: 'amount', dataIndex: 'amount', key: 'amount', className: styles.alignRight },
    { title: 'transDate', dataIndex: 'transDate', key: 'transDate', className: styles.alignRight },
    { title: 'batchNumber', dataIndex: 'batchNumber', key: 'batchNumber', className: styles.alignRight },
    { title: 'mdrAmount', dataIndex: 'mdrAmount', key: 'mdrAmount', className: styles.alignRight }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        pagination={false}
      // onRowClick={record => handleRowClick(record)}
      />
    </div>
  )
}

// ListPayment.propTypes = {
//   editItem: PropTypes.func,
//   deleteItem: PropTypes.func
// }

export default ListPayment
