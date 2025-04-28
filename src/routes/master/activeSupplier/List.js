import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import DropOption from 'components/DropOption'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ editItem, deleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.supplierName} ?`,
        onOk () {
          deleteItem(record.id)
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
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: 'Store',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy'
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
      width: 120,
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
