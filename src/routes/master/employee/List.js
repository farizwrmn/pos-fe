import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import moment from 'moment'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.employeeName} ?`,
        onOk () {
          deleteItem(record.employeeId)
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'employeeId',
      key: 'employeeId'
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
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName'
    },
    {
      title: 'Position',
      dataIndex: 'positionName',
      key: 'positionName'
    },
    {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01'
    },
    {
      title: 'Phone',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
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
          key: 'createdAt',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
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
          key: 'updatedAt',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
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
        columns={columns}
        simple
        scroll={{ x: 1500 }}
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
