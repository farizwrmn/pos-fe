/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import styles from '../../../../themes/index.less'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ dataSource, activeKey, ...browseProps }) => {
  let columns = []
  switch (activeKey) {
    case '3':
      columns.push(
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
          render: text => formatNumberIndonesia(parseFloat(text || 0))
        },
        {
          title: 'Amount',
          dataIndex: 'pAmount',
          key: 'pAmount',
          width: '150px',
          className: styles.alignRight,
          render: text => formatNumberIndonesia(parseFloat(text || 0))
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
          render: text => formatNumberIndonesia(parseFloat(text || 0))
        },
        {
          title: 'Amount',
          dataIndex: 'sAmount',
          key: 'sAmount',
          width: '150px',
          className: styles.alignRight,
          render: text => formatNumberIndonesia(parseFloat(text || 0))
        }
      )
      break
    default:
      columns.push(
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
      )
      break
  }

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
        // rowKey={record => record.transNo}
        dataSource={dataSource}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
