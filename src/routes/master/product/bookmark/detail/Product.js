import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      confirm({
        title: `Are you sure delete ${record.product.productName} ?`,
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
      key: 'product.productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'product.productName',
      key: 'product.productName'
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Delete', disabled: false }]} />
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
