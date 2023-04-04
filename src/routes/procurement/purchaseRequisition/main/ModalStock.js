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
      key: 'storeName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty'
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
