import React from 'react'
import { Modal, Form, Table } from 'antd'

const ModalEditQty = ({
  listStock,
  listPurchaseOrder,
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
  const columnsPurchaseOrder = [
    {
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Disc (%)',
      dataIndex: 'discPercent',
      key: 'discPercent',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Disc (N)',
      dataIndex: 'discNominal',
      key: 'discNominal',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Inv.Disc (%)',
      dataIndex: 'discInvoicePercent',
      key: 'discInvoicePercent',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Inv.Disc (N)',
      dataIndex: 'discInvoiceNominal',
      key: 'discInvoiceNominal',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Delivery Fee',
      dataIndex: 'deliveryFee',
      key: 'deliveryFee',
      render: text => (text || 0).toLocaleString()
    }
  ]
  return (
    <Modal
      width={800}
      {...modalProps}
    >
      <Table
        pagination={false}
        bordered
        columns={columnsPurchaseOrder}
        simple
        loading={loading}
        rowKey={record => record.id}
        dataSource={listPurchaseOrder}
      />
      <br />
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


export default Form.create()(ModalEditQty)
