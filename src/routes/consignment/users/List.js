import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Table } from 'antd'

const Confirm = Modal.confirm

const List = ({ ...tableProps, editUser, onFilterChange }) => {
  const confirmEdit = (record) => {
    Confirm({
      title: 'Edit',
      content: 'are you sure to edit this user?',
      onOk () { editUser(record) },
      onCancel () { }
    })
  }

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Outlet',
      dataIndex: 'outlet.outlet_name',
      key: 'outlet.outlet_name',
      render: value => value || '-'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: value => (value === 1 ? 'active' : 'non active')
    },
    {
      title: 'Peran',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: value => value || '-'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <Button type="primary" onClick={() => confirmEdit(record)}>
            Edit
          </Button>
        )
      }
    }
  ]

  const onChange = (pagination) => {
    const { current, pageSize } = pagination
    onFilterChange({ current, pageSize })
  }

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
