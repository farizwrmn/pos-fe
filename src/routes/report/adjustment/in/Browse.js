/**
 * Created by Veirry on 29/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '155px'
    },
    {
      title: 'Description',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px'
    },
    {
      title: 'QTY',
      dataIndex: 'qtyIn',
      key: 'qtyIn',
      width: '100px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: '100px',
      className: styles.alignRight,
      render: text => text.toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
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
        scroll={{ x: 890, y: 300 }}
        columns={columns}
        simple
        size="small"
      // rowKey={record => record.productCode}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
