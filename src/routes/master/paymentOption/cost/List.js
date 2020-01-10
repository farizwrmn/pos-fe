import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.counterName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'typeName',
      key: 'typeName',
      render: (text, data) => {
        return (
          <div>
            <div>Code: {data.typeCode}</div>
            <div>Name: {data.typeName}</div>
          </div>
        )
      }
    },
    {
      title: 'Parent',
      dataIndex: 'paymentParentName',
      key: 'paymentParentName'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text =>
        (<span>
          <Tag color={text === '1' ? 'blue' : 'red'}>
            {text === '1' ? 'Active' : 'Disabled'}
          </Tag>
        </span>)
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Delete' }
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
