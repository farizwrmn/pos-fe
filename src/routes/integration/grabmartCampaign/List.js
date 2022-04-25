import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { Link } from 'dva/router'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.accountName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <Link to={`/integration/grabmart-campaign/${record.id}`}>
            {text}
          </Link>
        )
      }
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
    },
    {
      title: 'Period',
      dataIndex: 'conditionsStartTime',
      key: 'conditionsStartTime',
      render: (text, record) => {
        return (
          <div>
            {record.conditionsStartTime} - {record.conditionsEndTime}
          </div>
        )
      }
    },
    {
      title: 'Discount Type',
      dataIndex: 'discountType',
      key: 'discountType',
      render: (text) => {
        if (text === 'net') {
          return 'Fixed Value'
        }
        if (text === 'net') {
          return 'Fixed Value'
        }
        return null
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '2', disabled: false, name: 'Delete' }]} />
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
