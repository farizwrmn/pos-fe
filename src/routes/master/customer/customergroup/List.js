import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.groupName} ?`,
        onOk () {
          deleteItem(record.groupCode)
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'groupCode',
      key: 'groupCode'
    },
    {
      title: 'Name',
      dataIndex: 'groupName',
      key: 'groupName'
    },
    {
      title: 'Pending Payment',
      dataIndex: 'pendingPayment',
      key: 'pendingPayment',
      render: text =>
        (<span>
          <Tag color={text === '1' ? 'blue' : 'red'}>
            {text === '1' ? 'Allow' : 'Disallowed'}
          </Tag>
        </span>)
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy'
        },
        {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt'
        }
      ]
    },
    {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy'
        },
        {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt'
        }
      ]
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
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
