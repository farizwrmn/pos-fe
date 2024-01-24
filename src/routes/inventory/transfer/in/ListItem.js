import React from 'react'
import PropTypes from 'prop-types'
import { Table, Icon } from 'antd'
import styles from '../../../../themes/index.less'

const ListItem = ({ ...tableProps }) => {
  const handleMenuClick = () => {
    // onModalVisible(record)
  }

  const columns = [
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Accept Qty',
      dataIndex: 'acceptQty',
      key: 'acceptQty',
      className: styles.alignCenter,
      render: (text, data) => {
        return (data && data.accept
          ? (<Icon type="check-circle" style={{ color: '#55a756' }} />)
          : data.acceptQty)
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        pagination={{
          showSizeChanger: true
        }}
        bordered
        columns={columns}
        simple
        size="small"
        scroll={{ x: '100%' }}
        rowKey={record => record.no}
        onRowClick={item => handleMenuClick(item)}
      />
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListItem
