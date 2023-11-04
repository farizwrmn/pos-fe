import React from 'react'
import { Table, Button, Modal } from 'antd'

const List = ({ onEdit, loading, ...tableProps }) => {
  const handleMenuClick = (record, state) => {
    let editState = state ? 'Enable' : 'Disable'
    Modal.confirm({
      title: `${editState} ${record.productName}`,
      content: 'Are you sure ?',
      onOk () {
        onEdit({
          ...record,
          active: state
        })
      }
    })
  }

  const columns = [
    {
      title: 'Store Id',
      dataIndex: 'storeId',
      key: 'storeId',
      render (text, record) {
        return (<div>{record.storeId}</div>)
      }
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
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
          return <Button type="danger" disabled={loading.effects['planogram/edit']} onClick={() => handleMenuClick(record, 0)}>Printed</Button>
        }
        return <Button type="primary" disabled={loading.effects['planogram/edit']} onClick={() => handleMenuClick(record, 1)}>Not Printed</Button>
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
        pagination={false}
      />
    </div>
  )
}

export default List
