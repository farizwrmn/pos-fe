import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { prefix } from 'utils/config.main'
import styles from '../../../../themes/index.less'

const Warning = Modal.warning

const Browse = ({
  modalShow, transNo, ...purchaseProps }) => {
  const dataBrowse = purchaseProps.purchase.dataBrowse ? purchaseProps.purchase.dataBrowse.filter(el => el.void !== 1) : {}
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '50px'
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '280px',
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
      width: '80px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'disc1',
      key: 'disc1',
      width: '120px',
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
      width: '120px',
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
      title: 'Delivery',
      dataIndex: 'deliveryFee',
      key: 'deliveryFee',
      width: '120px',
      className: styles.alignRight,
      render: (text, record) => {
        return (
          <div>
            <div><b>Portion: {(parseFloat(record.portion || 0).toFixed(2) || '-').toLocaleString()}</b></div>
            <div><b>Delivery: {(Math.round(record.deliveryFee || 0) || '-').toLocaleString()}</b></div>
          </div>
        )
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '120px',
      className: styles.alignRight,
      render: (text) => {
        return <div><b>{(text || '-').toLocaleString()}</b></div>
      }
    },
    {
      title: 'Ket',
      dataIndex: 'ket',
      key: 'ket',
      width: '120px',
      render: (ket) => {
        return (
          <span>
            <Tag color={ket === 'edit' ? 'blue' : 'green'}>
              {ket === 'edit' ? 'EDIT' : 'ADD'}
            </Tag>
          </span>
        )
      }
    }
  ]

  const hdlModalShow = (record) => {
    const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
    if (transNo.transDate < storeInfo.startPeriod) {
      Warning({
        title: 'Read-only Item',
        content: 'Cannot edit read-only Item'
      })
    } else {
      modalShow(record)
    }
  }

  return (
    <Table
      bordered
      scroll={{ x: 1000 }}
      columns={columns}
      simple
      size="small"
      pagination={{ pageSize: 5 }}
      dataSource={dataBrowse}
      onRowClick={_record => hdlModalShow(_record)}
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func.isRequired
}

export default Browse
