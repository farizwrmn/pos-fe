import React from 'react'
import { Modal, Form, Table } from 'antd'

const ModalStock = ({
  listStock,
  loading,
  ...modalProps
}) => {
  const columns = [
    {
      title: 'Store',
      dataIndex: 'storeName',
      key: 'storeName',
      render: (text, record) => {
        return <div style={{ color: record.qty <= 0 ? 'red' : 'initial' }}>{text}</div>
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      render: (text) => {
        return <div style={{ color: text <= 0 ? 'red' : 'initial' }}>{text}</div>
      }
    }
  ]
  return (
    <Modal
      {...modalProps}
    >
      <Table
        pagination={false}
        bordered
        columns={columns}
        simple
        loading={loading}
        rowKey={record => record.id}
        dataSource={listStock}
      />
    </Modal>
  )
}


export default Form.create()(ModalStock)
