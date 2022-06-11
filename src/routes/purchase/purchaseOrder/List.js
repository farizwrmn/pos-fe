import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    switch (e.key) {
      case '1': {
        editItem(record)
        break
      }
      case '2': {
        confirm({
          title: `Are you sure delete ${record.transNo} ?`,
          onOk () {
            deleteItem(record.id)
          }
        })
        break
      }
      default:
        break
    }
  }

  const columns = [
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        return (
          <Link to={`/transaction/purchase/order/${record.id}`}>
            {text}
          </Link>
        )
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).format('lll')
    },
    {
      title: 'Approve Date',
      dataIndex: 'approveDate',
      key: 'approveDate'
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
    },
    {
      title: 'Status',
      dataIndex: 'payableId',
      key: 'payableId',
      render: (text) => {
        if (text) {
          return (
            <Tag color="grey">
              Already Used
            </Tag>
          )
        }
        return (
          <Tag color="green">
            Available
          </Tag>
        )
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit', disabled: false }, { key: '2', name: 'Delete', disabled: false }]} />
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
