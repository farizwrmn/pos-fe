import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { DropOption } from 'components'

const List = ({ ...tableProps, editItem, voidItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      voidItem(record)
    }
  }

  const columns = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        return text === '0' ? 'Buy X Get Y' : 'Buy X Get Discount Y'
      }
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Period',
      dataIndex: 'Date',
      key: 'Date',
      render: (text, record) => {
        return `${record.startDate} ~ ${record.endDate}`
      }
    },
    {
      title: 'Available Date',
      dataIndex: 'availableDate',
      key: 'availableDate'
    },
    {
      title: 'Available Hour',
      dataIndex: 'availableHour',
      key: 'availableHour',
      render: (text, record) => {
        return `${record.startHour} ~ ${record.endHour}`
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: text => (
        <span>
          <Tag color={text === '1' ? 'green' : 'red'}>
            {text === '1' ? 'Active' : 'Cancelled'}
          </Tag>
        </span>
      )
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Void', disabled: record.status === '0' }]} />
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
