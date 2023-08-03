import React from 'react'
import { Card, Table } from 'antd'
import styles from '../../../themes/index.less'

const ListPayment = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'merchantId',
      key: 'merchantId'
    },
    { title: 'reference', dataIndex: 'reference', key: 'reference', className: styles.alignRight },
    { title: 'storeId', dataIndex: 'storeId', key: 'storeId', className: styles.alignRight },
    { title: 'storeIdPayment', dataIndex: 'storeIdPayment', key: 'storeIdPayment', className: styles.alignRight },
    { title: 'transDate', dataIndex: 'transDate', key: 'transDate', className: styles.alignRight },
    { title: 'typeCode', dataIndex: 'typeCode', key: 'typeCode', className: styles.alignRight },
    { title: 'amount', dataIndex: 'amount', key: 'amount', className: styles.alignRight },
    { title: 'description', dataIndex: 'description', key: 'description', className: styles.alignRight },
    { title: 'cardName', dataIndex: 'cardName', key: 'cardName', className: styles.alignRight },
    { title: 'cardNo', dataIndex: 'cardNo', key: 'cardNo', className: styles.alignRight },
    { title: 'printDate', dataIndex: 'printDate', key: 'printDate', className: styles.alignRight },
    { title: 'active', dataIndex: 'active', key: 'active', className: styles.alignRight },
    { title: 'memo', dataIndex: 'memo', key: 'memo', className: styles.alignRight },
    {
      title: 'Created',
      dataIndex: 'createdBy',
      key: 'createdBy'
    }
  ]

  return (
    <div>
      <Card bordered={false}>
        <Table {...tableProps}
          bordered
          columns={columns}
          simple
          scroll={{ x: 1200 }}
          rowKey={record => record.id}
        />
      </Card>
    </div>
  )
}

// ListPayment.propTypes = {
//   editItem: PropTypes.func,
//   deleteItem: PropTypes.func
// }

export default ListPayment
