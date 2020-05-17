import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const ListItem = ({ ...tableProps, onModalVisible }) => {
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
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        size="small"
        scroll={{ x: 1000 }}
        rowKey={record => record.no}
        onRowClick={item => handleMenuClick(item)}
      />
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListItem
