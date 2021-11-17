import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.voucherName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Code',
      dataIndex: 'voucherCode',
      key: 'voucherCode'
    },
    {
      title: 'Voucher Name',
      dataIndex: 'voucherName',
      key: 'voucherName'
    },
    {
      title: 'Count',
      dataIndex: 'voucherCount',
      key: 'voucherCount'
    },
    {
      title: 'Expire Date',
      dataIndex: 'expireDate',
      key: 'expireDate'
    },
    {
      title: 'Price',
      dataIndex: 'voucherPrice',
      key: 'voucherPrice'
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active'
    },
    {
      title: 'Sold Out',
      dataIndex: 'soldOut',
      key: 'soldOut'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
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
