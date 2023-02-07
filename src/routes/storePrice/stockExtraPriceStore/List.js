import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'
import { getDistPriceName } from 'utils/string'
import styles from '../../../themes/index.less'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.product.productName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Store ID',
      dataIndex: 'storeId',
      key: 'storeId'
    },
    {
      title: 'Store',
      dataIndex: 'store.storeName',
      key: 'store.storeName'
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'Product',
      dataIndex: 'product.productName',
      key: 'product.productName'
    },
    {
      title: getDistPriceName('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice01'),
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice02'),
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice03'),
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice04'),
      dataIndex: 'distPrice04',
      key: 'distPrice04',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice05'),
      dataIndex: 'distPrice05',
      key: 'distPrice05',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice06'),
      dataIndex: 'distPrice06',
      key: 'distPrice06',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice07'),
      dataIndex: 'distPrice07',
      key: 'distPrice07',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice08'),
      dataIndex: 'distPrice08',
      key: 'distPrice08',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: getDistPriceName('distPrice09'),
      dataIndex: 'distPrice09',
      key: 'distPrice09',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy'
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: _text => `${moment(_text).format('LLL')}`
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete', disabled: false }]} />
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
