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
        title: `Are you sure delete ${record.couponName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Coupon Name',
      dataIndex: 'couponName',
      key: 'couponName'
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: text => new Date(text).toLocaleDateString() // Format the date
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: text => new Date(text).toLocaleDateString()
    },
    {
      title: 'Minimum Payment',
      dataIndex: 'minimumPayment',
      key: 'minimumPayment',
      render: text => `Rp ${Number(text).toLocaleString('id-ID')}` // Format currency
    },
    {
      title: 'Multiplier Payment',
      dataIndex: 'multiplierPayment',
      key: 'multiplierPayment',
      render: text => `Rp ${Number(text).toLocaleString('id-ID')}`
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: text => (text === '1' ? 'Yes' : 'No')
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => new Date(text).toLocaleString()
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy'
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: text => new Date(text).toLocaleString()
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => (
        <DropOption
          onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: 'Edit' },
            { key: '2', name: 'Delete', disabled: true }
          ]}
        />
      )
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
