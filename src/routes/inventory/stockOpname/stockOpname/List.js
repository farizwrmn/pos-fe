import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'dva/router'
import { Table } from 'antd'

const List = ({ location, ...tableProps }) => {
  console.log('location', location)
  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'store.storeName',
      key: 'store.storeName',
      render: (text, record) => {
        return <Link to={`${location.pathname}/${record.id}`}>{text}</Link>
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Adjust In',
      dataIndex: 'adjustInId',
      key: 'adjustInId',
      render: (text) => {
        return <a target="_blank" href={`/transaction/adjust/${text}`}>{text}</a>
      }
    },
    {
      title: 'Adjust In',
      dataIndex: 'adjustInTotal',
      key: 'adjustInTotal',
      render: text => (text || '').toLocaleString()
    },
    {
      title: 'Adjust Out',
      dataIndex: 'adjustOutId',
      key: 'adjustOutId',
      render: (text) => {
        return <a target="_blank" href={`/transaction/adjust/${text}`}>{text}</a>
      }
    },
    {
      title: 'Adjust Out',
      dataIndex: 'adjustOutTotal',
      key: 'adjustOutTotal',
      render: text => (text || '').toLocaleString()
    },
    {
      title: 'Start',
      dataIndex: 'scheduleStart',
      key: 'scheduleStart',
      render: (text, item) => {
        if (text) {
          return moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        }
        return null
      }
    },
    {
      title: 'End',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text, item) => {
        if (item.status) {
          return moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        }
        return null
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
