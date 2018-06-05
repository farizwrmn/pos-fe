import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
// import styles from '../../../../../themes/index.less'

const ListItem = ({ ...tableProps, activeKey, selectedRowKeys, updateSelectedKey, onModalVisible }) => {
  const handleMenuClick = (record) => {
    onModalVisible(record)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render (text) {
        return {
          children: <div style={{ textAlign: 'right' }}>{(text || '').toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      render (text) {
        return {
          children: <div>{text.toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      render (text) {
        return {
          children: <div>{text.toLocaleString()}</div>
        }
      }
    },
    {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render (text, record) {
        const oldPriceHandler = (record.prevSellPrice === 0 ? (text === 0 ? 1 : text) : record.prevSellPrice || 0)
        const oldPrice = (record.prevSellPrice || 0)
        const diffPrice = ((text || 0) - oldPrice)
        return {
          children: <div style={{ textAlign: 'right' }}>
            {`${(record.prevSellPrice || 0).toLocaleString()} to `}
            <strong style={{ fontSize: '14px' }}>{`${text.toLocaleString()} `}</strong>
            ({parseFloat((diffPrice / oldPriceHandler) * 100).toFixed(2)} %)
          </div>
        }
      }
    },
    {
      title: 'Dist Price 01',
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      render (text, record) {
        const oldPriceHandler = (record.prevDistPrice01 === 0 ? (text === 0 ? 1 : text) : record.prevDistPrice01 || 0)
        const oldPrice = (record.prevDistPrice01 || 0)
        const diffPrice = ((text || 0) - oldPrice)
        return {
          children: <div style={{ textAlign: 'right' }}>
            {`${(record.prevDistPrice01 || 0).toLocaleString()} to `}
            <strong style={{ fontSize: '14px' }}>{`${text.toLocaleString()} `}</strong>
            ({parseFloat((diffPrice / oldPriceHandler) * 100).toFixed(2)} %)
          </div>
        }
      }
    },
    {
      title: 'Dist Price 02',
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      render (text, record) {
        const oldPriceHandler = (record.prevDistPrice02 === 0 ? (text === 0 ? 1 : text) : record.prevDistPrice02 || 0)
        const oldPrice = (record.prevDistPrice02 || 0)
        const diffPrice = ((text || 0) - oldPrice)
        return {
          children: <div style={{ textAlign: 'right' }}>
            {`${(record.prevDistPrice02 || 0).toLocaleString()} to `}
            <strong style={{ fontSize: '14px' }}>{`${text.toLocaleString()} `}</strong>
            ({parseFloat((diffPrice / oldPriceHandler) * 100).toFixed(2)} %)
          </div>
        }
      }
    }
  ]

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      updateSelectedKey(selectedRowKeys)
    }
  }

  return (
    <div>
      {activeKey === '0' ?
        <Table {...tableProps}
          bordered
          columns={columns}
          simple
          rowSelection={rowSelection}
          selectedRowKeys={selectedRowKeys}
          size="small"
          scroll={{ x: 1000 }}
          rowKey={record => record.no}
          onRowClick={item => handleMenuClick(item)}
        /> :
        <Table {...tableProps}
          bordered
          columns={columns}
          simple
          size="small"
          scroll={{ x: 1000 }}
          rowKey={record => record.no}
          onRowClick={item => handleMenuClick(item)}
        />}
    </div>
  )
}

ListItem.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default ListItem
