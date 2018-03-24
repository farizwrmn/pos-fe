import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

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
      key: 'qty',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Disc %',
      dataIndex: 'disc1',
      key: 'disc1',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Disc NML',
      dataIndex: 'discount',
      key: 'discount',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'PPN',
      dataIndex: 'ppn',
      key: 'ppn',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: styles.alignRight,
      render: text => text.toLocaleString()
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
