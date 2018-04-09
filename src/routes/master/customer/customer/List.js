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
        title: `Are you sure delete ${record.memberName} ?`,
        onOk () {
          deleteItem(record.memberCode)
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'memberCode',
      key: 'memberCode'
    },
    {
      title: 'Name',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: 'Member Group Name',
      dataIndex: 'memberGroupName',
      key: 'memberGroupName'
    },
    {
      title: 'Member Type Name',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName'
    },
    {
      title: 'ID Type',
      dataIndex: 'idType',
      key: 'idType'
    },
    {
      title: 'ID No',
      dataIndex: 'idNo',
      key: 'idNo'
    },
    {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01'
    },
    {
      title: 'City',
      dataIndex: 'cityName',
      key: 'cityName'
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state'
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
        scroll={{ x: 1800 }}
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
