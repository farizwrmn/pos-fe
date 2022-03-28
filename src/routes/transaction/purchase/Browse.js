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
      key: 'no',
      width: '70px'
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '380px',
      render: (text, record) => {
        return (
          <div>
            <div><b>{text}</b></div>
            <div>{record.name}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '100px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'disc1',
      key: 'disc1',
      width: '150px',
      className: styles.alignRight,
      render: (text, record) => {
        return (
          <div>
            <div><b>Price: {(record.price || '-').toLocaleString()}</b></div>
            <div>Disc (%): {(text || '-').toLocaleString()}</div>
            <div>Disc (N): {(record.discount || '-').toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'TAX',
      dataIndex: 'dpp',
      key: 'dpp',
      width: '150px',
      className: styles.alignRight,
      render: (text, record) => {
        return (
          <div>
            <div><b>DPP: {(text || '-').toLocaleString()}</b></div>
            <div>PPN: {(record.ppn || '-').toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '150px',
      className: styles.alignRight,
      render: (text) => {
        return <div><b>{(text || '-').toLocaleString()}</b></div>
      }
    }
  ]

  const hdlModalShow = (record) => {
    modalShow(record)
  }

  return (
    <Table
      bordered
      scroll={{ x: 1000 }}
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
