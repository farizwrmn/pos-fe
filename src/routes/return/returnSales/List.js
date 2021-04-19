import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'

const confirm = Modal.confirm

const List = ({ ...tableProps, approveItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    switch (e.key) {
      case '2': {
        confirm({
          title: `Are you sure delete ${record.transNo} ?`,
          onOk () {
            deleteItem(record.id)
          }
        })
        break
      }
      case '3': {
        confirm({
          title: `Are you sure approve ${record.transNo} ?`,
          onOk () {
            approveItem(record.id)
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
          <Link to={`/transaction/return-sales/${record.id}`}>
            {text}
          </Link>
        )
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '3', name: 'Approve' }, { key: '2', name: 'Delete', disabled: false }]} />
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
