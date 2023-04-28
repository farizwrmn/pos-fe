import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from 'themes/index.less'

const ListItem = ({ listItem, deliveryFee, onModalVisible, ...tableProps }) => {
  const handleMenuClick = (record) => {
    onModalVisible(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: '60px',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{text}</div>
        }
      }
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '350px',
      render (text, record) {
        return (
          <div>
            <div><b>{record.productCode}</b> {record.productName}</div>
            <div>D: {record.dimension} P: {record.dimensionPack} B: {record.dimensionBox}</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '70px',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{(text || '-').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: '140px',
      className: styles.alignRight,
      render: (text, record) => {
        return (
          <div>
            <div><b>Price: {(record.purchasePrice || '-').toLocaleString()}</b></div>
            <div>Disc (%): {(record.discPercent || '-').toLocaleString()}</div>
            <div>Disc (N): {(record.discNominal || '-').toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'TAX',
      dataIndex: 'DPP',
      key: 'DPP',
      width: '140px',
      className: styles.alignRight,
      render: (text, record) => {
        return (
          <div>
            <div><b>DPP: {(record.DPP || '-').toLocaleString()}</b></div>
            <div>PPN: {(record.PPN || '-').toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'Delivery',
      dataIndex: 'deliveryFee',
      key: 'deliveryFee',
      width: '140px',
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
      width: '140px',
      className: styles.alignRight,
      render: (text) => {
        return (
          <div>
            <div><b>Total: {(text || '-').toLocaleString()}</b></div>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        size="small"
        scroll={{ x: 1000 }}
        onRowClick={item => handleMenuClick(item)}
        footer={() => {
          return (
            <div>
              <div>Qty: {(listItem ? listItem.reduce((prev, next) => prev + next.qty, 0) : 0).toLocaleString()}</div>
              <div>Total: {(listItem ? listItem.reduce((prev, next) => prev + next.total, 0) + (deliveryFee || 0) : 0).toLocaleString()}</div>
            </div>
          )
        }}
      />
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func
}

export default ListItem
