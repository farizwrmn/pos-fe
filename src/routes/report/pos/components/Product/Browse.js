/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../../../themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '175px',
      render: text => `${moment(text).format('LL ')}`
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '155px'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'Qty',
      key: 'Qty',
      width: '60px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      width: '100px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'discountTotal',
      key: 'discountTotal',
      width: '100px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Netto',
      dataIndex: 'Netto',
      key: 'Netto',
      width: '100px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    }
  ]

  return (
    <div>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        scroll={{ x: 1000, y: 300 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.createdAt + record.productCode}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
