/**
 * Created by Veirry on 24/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'
import styles from '../../../../themes/index.less'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '150px'
    },
    {
      title: 'Type',
      dataIndex: 'transType',
      key: 'transType',
      width: '50px'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
      render: text => moment(text).format('LL')
    },
    {
      title: 'IN',
      dataIndex: 'pQty',
      key: 'pQty',
      width: '50px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'pPrice',
      key: 'pPrice',
      width: '100px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: 'Amount',
      dataIndex: 'pAmount',
      key: 'pAmount',
      width: '150px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: 'Out',
      dataIndex: 'sQty',
      key: 'sQty',
      width: '50px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'sPrice',
      key: 'sPrice',
      width: '100px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      title: 'Amount',
      dataIndex: 'sAmount',
      key: 'sAmount',
      width: '150px',
      className: styles.alignRight,
      render: text => parseFloat(text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
