import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'dva/router'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ editItem, deleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure to delete this record ?',
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'store.storeName',
      key: 'store.storeName',
      render: (text, record) => {
        return <Link to={`/stock-opname/${record.id}`}>{text}</Link>
      }
    },
    {
      title: 'Start',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, item) => {
        if (text) {
          return moment(item.startDate).format('YYYY-MM-DD HH:mm:ss')
        }
        return null
      }
    },
    {
      title: 'End',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text, item) => {
        if (text) {
          return moment(item.endDate).format('YYYY-MM-DD HH:mm:ss')
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
