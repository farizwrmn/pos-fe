import React from 'react'
import { Table, Button, Modal } from 'antd'
import moment from 'moment'

const List = ({ onEdit, loading, ...tableProps }) => {
  const handleMenuClick = (record, state) => {
    Modal.confirm({
      title: 'Validate planogram',
      content: 'Are you sure already print planogram file from given url ?',
      onOk () {
        onEdit({
          ...record,
          isPrinted: state
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
            <div>{record.url}</div>
          )
        }
      }
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: (
            <div>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</div>
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
        if (Number(record.isPrinted) === 1) {
          return <Button type="danger" disabled={loading.effects['planogram/edit']}>Printed</Button>
        }
        return <Button type="primary" disabled={loading.effects['planogram/edit']} onClick={() => handleMenuClick(record, 1)}>Validate Printed</Button>
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
