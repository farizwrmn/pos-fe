import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Table } from 'antd'
import { DropOption } from 'components'

const Confirm = Modal.confirm

const List = ({ ...tableProps, showConfirmation, editItem, deleteItem, onFilterChange }) => {
  const handleMenuClick = (record, event) => {
    Confirm({
      title: `${event.key === '1' ? 'Edit' : 'Delete'} outlet`,
      content: `Are you sure to ${event.key === '1' ? 'edit' : 'delete'} this outlet?`,
      onCancel () { },
      onOk () {
        if (event.key === '1') {
          editItem(record)
        }
        if (event.key === '2') {
          deleteItem(record)
        }
      }
    })
  }

  const onChange = (pagination) => {
    onFilterChange({ pagination })
  }

  const columns = [
    {
      title: 'Action',
      width: '50px',
      render: (_, record) => <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete', disabled: false }]} />
    },
    {
      title: 'Outlet Code',
      dataIndex: 'outlet_code',
      key: 'outlet_code'
    },
    {
      title: 'Nama Outlet',
      dataIndex: 'outlet_name',
      key: 'outlet_name'
    },
    {
      title: 'Keterangan',
      dataIndex: 'commission_food',
      key: 'commission_food',
      render: (_, record) => {
        return (
          <div style={{ padding: '10px' }}>
            <div>Food Commission : {record.commission_food}%</div>
            <div>Non Food Commission : {record.commission_non_food}%</div>
            <Button onClick={() => showConfirmation(record)} type="primary" size="small" style={{ marginTop: '10px' }}>Click for more info!</Button>
          </div>
        )
      }
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address'
    }
  ]

  return (
    <Table {...tableProps}
      bordered
      columns={columns}
      simple
      scroll={{ x: 1000 }}
      rowKey={record => record.id}
      onChange={onChange}
    />
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
