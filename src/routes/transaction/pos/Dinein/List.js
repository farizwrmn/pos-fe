import React from 'react'
import { Table, Button } from 'antd'

const List = ({ onEditItem, loading, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onEditItem(record)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => (text || '-').toLocaleString()
    },
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
            <div>
              <div>{record.productCode}</div>
              <div>{record.productName}</div>
              <div>Dimension: {record.dimension} Pack: {record.dimensionPack} Box: {record.dimensionBox}</div>
            </div>
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
