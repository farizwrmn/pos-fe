import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({
  modalShow, ...purchaseProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Disc %',
      dataIndex: 'disc1',
      key: 'disc1',
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Disc NML',
      dataIndex: 'discount',
      key: 'discount',
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'PPN',
      dataIndex: 'ppn',
      key: 'ppn',
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: text => (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    },
    {
      title: 'Ket',
      dataIndex: 'ket',
      key: 'ket'
    }
  ]

  const hdlModalShow = (record) => {
    modalShow(record)
  }

  return (
    <Table
      bordered
      scroll={{ x: 1300 }}
      columns={columns}
      simple
      size="small"
      pagination={{ pageSize: 5 }}
      dataSource={purchaseProps.purchase.dataBrowse}
      onRowClick={_record => hdlModalShow(_record)}
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func
}

export default Browse
