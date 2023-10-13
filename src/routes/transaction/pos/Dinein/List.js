import React from 'react'
import { Table, Button } from 'antd'

const List = ({ onEditItem, loading, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onEditItem(record)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: (
            <div>{record.productName}</div>
          )
        }
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        if (Number(record.active) === 1) {
          return <Button type="danger" disabled={loading.effects['pos/editExpress'] || loading.effects['pos/editExpressItem'] || loading.effects['pos/queryExpress']} onMenuClick={e => handleMenuClick(record, e)}>Disable</Button>
        }
        return <Button type="primary" disabled={loading.effects['pos/editExpress'] || loading.effects['pos/editExpressItem'] || loading.effects['pos/queryExpress']} onMenuClick={e => handleMenuClick(record, e)}>Enable</Button>
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 500 }}
        columns={columns}
        simple
        onRowClick={record => handleMenuClick(record)}
        pagination={false}
      />
    </div>
  )
}

export default List
