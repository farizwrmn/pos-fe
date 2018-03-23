/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../../themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '155px'
    },
    {
      title: 'qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '60px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      width: '100px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      width: '120px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      width: '120px',
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
        scroll={{ x: '555', y: 300 }}
        columns={columns}
        simple
        size="small"
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
