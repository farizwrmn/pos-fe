import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ ...tableProps,
  editItem,
  deleteItem
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.program} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 60,
      render: (text, record) => {
        return (
          <div>
            <div>{record.level}</div>
          </div>
        )
      }
    },
    {
      title: 'Program',
      dataIndex: 'program',
      key: 'program',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <div>{record.program}</div>
          </div>
        )
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: 250,
      render: (text, record) => {
        return (
          <div>
            <div>{record.product.productCode}</div>
            <div>{record.product.productName}</div>
          </div>
        )
      }
    },
    {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: 120,
      render: (text, record) => {
        return (
          <div>
            <div>{record.product && record.product.sellPrice ? (record.product.sellPrice).toLocaleString() : 0}</div>
          </div>
        )
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Delete', disabled: false }
            ]}
          />
        )
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
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
