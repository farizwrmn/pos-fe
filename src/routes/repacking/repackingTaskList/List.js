import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Table, Tag } from 'antd'
import { DropOption } from 'components'

const List = ({ onOpenModalFinish, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onOpenModalFinish(record)
    }
  }

  const columns = [
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      width: '200px',
      key: 'transNo',
      render: (text, record) => {
        return (
          <Link to={`/repacking-spk/${record.id}`}>{text}</Link>
        )
      }
    },
    {
      title: 'Store',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Target',
      dataIndex: 'storeReceiverName',
      key: 'storeReceiverName'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '200px'
    },
    {
      title: 'Status',
      dataIndex: 'statusText',
      key: 'statusText',
      render: (text) => {
        return (
          <Tag color="green">
            {text}
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
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Finish' }]} />
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
