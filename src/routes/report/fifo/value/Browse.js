/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const Browse = ({ dataSource, ...browseProps }) => {
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
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Purchase Qty',
      dataIndex: 'purchaseQty',
      key: 'purchaseQty',
      width: '150px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Transfer IN',
      dataIndex: 'transferInQty',
      key: 'transferInQty',
      width: '150px',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Adjust IN',
      dataIndex: 'adjInQty',
      key: 'adjInQty',
      width: '150px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'POS Qty',
      dataIndex: 'posQty',
      key: 'posQty',
      width: '150px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Transfer OUT',
      dataIndex: 'transferOutQty',
      key: 'transferOutQty',
      width: '150px',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Adjust OUT',
      dataIndex: 'adjOutQty',
      key: 'adjOutQty',
      width: '150px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      width: '150px',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    }
  ]

  return (
    <Table
      {...browseProps}
      footer={() => (
        <div>
          <div>BeginCount : {dataSource.reduce((cnt, o) => cnt + parseFloat(o.beginQty || 0), 0).toLocaleString()}</div>
          <div>BeginValue : {dataSource.reduce((cnt, o) => cnt + parseFloat(o.beginPrice || 0), 0).toLocaleString()}</div>
          <div>TotalCount : {dataSource.reduce((cnt, o) => cnt + parseFloat(o.count || 0), 0).toLocaleString()}</div>
          <div>TotalValue : {dataSource.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0).toLocaleString()}</div>
        </div>)}
      bordered
      scroll={{ x: 1000, y: 300 }}
      columns={columns}
      simple
      size="small"
      rowKey={record => record.productCode}
      dataSource={dataSource}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
