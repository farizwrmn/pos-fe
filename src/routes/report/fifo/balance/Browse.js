/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table } from 'antd'

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
        width: '50px',
        render: text => <p style={{ textAlign: 'left' }}>{text}</p>
      },
      {
        title: 'Date',
        dataIndex: 'transDate',
        key: 'transDate',
        width: '175px',
        render: text => <p style={{ textAlign: 'left' }}>{moment(text).format('LL')}</p>
      },
      {
        title: 'IN',
        dataIndex: 'pQty',
        key: 'pQty',
        width: '50px',
        render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || 0)}</p>
      },
      {
        title: 'Price',
        dataIndex: 'pPrice',
        key: 'pPrice',
        width: '100px',
        render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      },
      {
        title: 'Amount',
        dataIndex: 'pAmount',
        key: 'pAmount',
        width: '150px',
        render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      },
      {
        title: 'Out',
        dataIndex: 'sQty',
        key: 'sQty',
        width: '50px',
        render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || 0)}</p>
      },
      {
        title: 'Price',
        dataIndex: 'sPrice',
        key: 'sPrice',
        width: '100px',
        render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      },
      {
        title: 'Amount',
        dataIndex: 'sAmount',
        key: 'sAmount',
        width: '150px',
        render: text => <p style={{ textAlign: 'right' }}>{(parseFloat(text) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
        render: text => <p style={{ textAlign: 'right' }}>{text}</p>
      },
      {
        title: 'Purchase Qty',
        dataIndex: 'purchaseQty',
        key: 'purchaseQty',
        width: '150px',
        render: text => <p style={{ textAlign: 'right' }}>{text}</p>
      },
      {
        title: 'Adjust IN',
        dataIndex: 'adjInQty',
        key: 'adjInQty',
        width: '150px',
        render: text => <p style={{ textAlign: 'right' }}>{text}</p>
      },
      {
        title: 'POS Qty',
        dataIndex: 'posQty',
        key: 'posQty',
        width: '150px',
        render: text => <p style={{ textAlign: 'right' }}>{text}</p>
      },
      {
        title: 'Adjust OUT',
        dataIndex: 'adjOutQty',
        key: 'adjOutQty',
        width: '150px',
        render: text => <p style={{ textAlign: 'right' }}>{text}</p>
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
        width: '150px',
        render: text => <p style={{ textAlign: 'right' }}>{text}</p>
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
        rowKey={record => record.transNo}
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
