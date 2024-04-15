import React from 'react'
import PropTypes from 'prop-types'
import { Table, InputNumber } from 'antd'
import styles from '../../../../themes/index.less'

const ListItem = ({ ...tableProps, onModalVisible, handleItemEdit }) => {
  const handleMenuClick = (record) => {
    onModalVisible(record)
  }

  const handleBlurQty = (productId, qty, event) => {
    event.target.value = parseFloat(qty)
  }

  const handleFocus = (event) => {
    event.target.select()
  }

  const handleChangeQty = (record, event) => {
    const qty = event.target.value
    handleItemEdit({
      ...record,
      qty: parseFloat(qty) > 0 ? parseFloat(qty) : 0
    }, event)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
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
      dataIndex: 'productCode',
      key: 'productCode',
      onCellClick: (item) => {
        handleMenuClick(item)
      },
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: (
            <div>
              <div>{record.productCode}</div>
              <div>{record.productName}</div>
              <div>Dimension: {record.dimension} Pack: {record.dimensionPack} Box: {record.dimensionBox}</div>
              <div>Note: {record.description}</div>
              <div style={{ fontSize: '10px' }}>click to edit</div>
            </div>
          )
        }
      }
    },
    {
      title: (<strong>Qty</strong>),
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: (
            <div>
              <InputNumber
                key={record.productId}
                value={text}
                max={record && record.stock > 0 ? record.stock : undefined}
                onBlur={event => handleBlurQty(record.productId, text, event)}
                onFocus={event => handleFocus(event)}
                onKeyDown={(event) => {
                  if (event.keyCode === 13) {
                    handleChangeQty(record, event)
                  }
                }}
              />
            </div>
          )
        }
      }
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
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
      title: 'Stock in Destination',
      dataIndex: 'qtyStore',
      key: 'qtyStore',
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
      title: 'Demand',
      dataIndex: 'qtyDemand',
      key: 'qtyDemand',
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
    }
  ]

  return (
    <div>
      <form>
        <Table {...tableProps}
          pagination={false}
          bordered
          columns={columns}
          simple
          size="small"
          scroll={{ x: 1000 }}
          rowKey={record => record.no}
        />
      </form>
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListItem
