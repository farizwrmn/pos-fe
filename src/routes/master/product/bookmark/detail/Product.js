import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ editItem, deleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    }
    if (e.key === '2') {
      confirm({
        title: record.product ? `Are you sure delete ${record.product.productName} ?` : 'Are you sure delete this item ?',
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'product.productCode',
      key: 'product.productCode',
      render: (text, record) => {
        if (record.type === 'PRODUCT') {
          return record.product.productCode
        }

        if (record.type === 'BUNDLE') {
          return record.bundle.code
        }
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'product.productName',
      key: 'product.productName',
      render: (text, record) => {
        if (record.type === 'PRODUCT') {
          return record.product.productName
        }

        if (record.type === 'BUNDLE') {
          return record.bundle.name
        }
      }
    },
    {
      title: 'Shortcut Code',
      dataIndex: 'shortcutCode',
      key: 'shortcutCode'
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete', disabled: false }]} />
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
