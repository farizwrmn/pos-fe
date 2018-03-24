/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '227px'
    },
    {
      title: 'Begin',
      dataIndex: 'beginQty',
      key: 'beginQty',
      width: '150px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Purchase Qty',
      dataIndex: 'purchaseQty',
      key: 'purchaseQty',
      width: '150px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Adjust IN',
      dataIndex: 'adjInQty',
      key: 'adjInQty',
      width: '150px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'POS Qty',
      dataIndex: 'posQty',
      key: 'posQty',
      width: '150px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Adjust OUT',
      dataIndex: 'adjOutQty',
      key: 'adjOutQty',
      width: '150px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      width: '150px',
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
        rowKey={record => record.transNo}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
