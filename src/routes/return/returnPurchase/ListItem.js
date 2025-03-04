import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from 'themes/index.less'
import { currencyFormatter } from 'utils/string'

const ListItem = ({ ...tableProps, listItem, onModalVisible }) => {
  const handleMenuClick = (record) => {
    onModalVisible(record)
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
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode',
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
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName',
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
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
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
      dataIndex: 'DPP',
      key: 'DPP',
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
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      className: styles.alignRight,
      // render: text => (text || '-').toLocaleString()
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{(record.qty * record.DPP || '-').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: <div>{text}</div>
        }
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
              <div>Total Qty: {currencyFormatter(listItem ? listItem.reduce((prev, next) => prev + next.qty, 0) : 0)}</div>
              <div>Total Price: {currencyFormatter(listItem ? listItem.reduce((prev, next) => prev + (next.qty * next.DPP), 0) : 0)}</div>
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
