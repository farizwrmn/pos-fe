import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table } from 'antd'
import { numberFormatter } from 'utils/string'

import styles from '../../../themes/index.less'
import ModalCategory from './ModalCategory'

const List = ({ onClicGrabCategory, modalCategoryVisible, modalCategoryProps, listGrabCategory, onSave, ...tableProps }) => {
  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 110
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: 165
    },
    {
      title: 'Category',
      dataIndex: 'grabCategoryName',
      key: 'grabCategoryName',
      width: 165
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 135
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      width: 80
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight,
      width: 60,
      render: text => numberFormatter(text)
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      className: styles.alignRight,
      width: 75,
      render: text => numberFormatter(text)
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
      className: styles.alignRight,
      width: 100,
      render: (text, record) => {
        return `${numberFormatter(record.commission)} ${record.commission > 0 && record.price ? `(${(((record.commission) / record.price) * 100)} %)` : ''}`
      }
    },
    {
      title: 'Update Note',
      dataIndex: 'updateNote',
      key: 'updateNote',
      width: 125
    }
  ]

  return (
    <div>
      {modalCategoryVisible && <ModalCategory {...modalCategoryProps} />}
      <Button disabled={tableProps.loading} type="default" onClick={onClicGrabCategory} style={{ marginRight: '10px' }}>Category</Button>
      {tableProps && tableProps.selectedRowKeys && tableProps.selectedRowKeys.length > 0 && <Button disabled={tableProps.loading} type="primary" onClick={onSave} style={{ marginRight: '10px' }}>Validate</Button>}
      <Table {...tableProps}
        style={{ marginTop: '10px' }}
        bordered
        size="small"
        columns={columns}
        simple
        scroll={{ x: 1080 }}
        pagination={false}
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
