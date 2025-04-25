import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import DropOption from 'components/DropOption'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.supplierName} ?`,
        onOk () {
          deleteItem(record.supplierCode)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Supplier ID',
      dataIndex: 'supplierId',
      key: 'supplierId'
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'Store ID',
      dataIndex: 'storeId',
      key: 'storeId'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: text => text.toLocaleString() // optional formatting
    },
    {
      title: 'Disc 1 (%)',
      dataIndex: 'disc1',
      key: 'disc1'
    },
    {
      title: 'Disc 2 (%)',
      dataIndex: 'disc2',
      key: 'disc2'
    },
    {
      title: 'Disc 3 (%)',
      dataIndex: 'disc3',
      key: 'disc3'
    },
    {
      title: 'Disc 4 (%)',
      dataIndex: 'disc4',
      key: 'disc4'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <DropOption
          onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: 'Edit' },
            { key: '2', name: 'Delete' }
          ]}
        />
      )
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1700 }}
        rowKey={record => record.id}
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} items`
        }}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
