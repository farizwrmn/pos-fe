import React from 'react'
import { Modal, Form, Table } from 'antd'

const ModalEditSupplier = ({
  listSupplierHistory,
  loading,
  ...modalProps
}) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'supplierCode',
      key: 'supplierCode'
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName'
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
        dataSource={listSupplierHistory}
      />
    </Modal>
  )
}


export default Form.create()(ModalEditSupplier)
