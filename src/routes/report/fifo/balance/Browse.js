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
          render: text => (text === '' ? '-' : numberFormat.numberFormatter(text))
        },
        {
          title: 'Out',
          dataIndex: 'sQty',
          key: 'sQty',
          width: '50px',
          className: styles.alignRight,
          render: text => (text === '' ? '-' : numberFormat.numberFormatter(text))
        }
      )
      break
    default:
      columns.push(
        {
          title: 'Product Code',
          dataIndex: 'productCode',
          key: 'productCode',
          width: '227px',
          render: (text, record) => {
            return (
              <div>
                <div>{record.productCode}</div>
                <div>{record.productName}</div>
              </div>
            )
          }
        },
        {
          title: 'Sell Price',
          dataIndex: 'sellPrice',
          key: 'sellPrice',
          width: '227px',
          render: (text, record) => {
            return (
              <div>
                <div>{`sellPrice: ${formatNumberIndonesia(record.sellPrice)}`}</div>
                <div>{`distPrice01: ${formatNumberIndonesia(record.distPrice01)}`}</div>
                <div>{`distPrice02: ${formatNumberIndonesia(record.distPrice02)}`}</div>
                <div>{`distPrice03: ${formatNumberIndonesia(record.distPrice03)}`}</div>
                <div>{`distPrice04: ${formatNumberIndonesia(record.distPrice04)}`}</div>
                <div>{`distPrice05: ${formatNumberIndonesia(record.distPrice05)}`}</div>
                <div>{`distPrice06: ${formatNumberIndonesia(record.distPrice06)}`}</div>
                <div>{`distPrice07: ${formatNumberIndonesia(record.distPrice07)}`}</div>
                <div>{`distPrice08: ${formatNumberIndonesia(record.distPrice08)}`}</div>
                <div>{`distPrice09: ${formatNumberIndonesia(record.distPrice09)}`}</div>
              </div>
            )
          }
        },
        {
          title: 'Count',
          dataIndex: 'count',
          key: 'count',
          width: '150px',
          className: styles.alignRight,
          render: text => (text || '-').toLocaleString()
        }
      )
      break
  }

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: 1000, y: 300 }}
      columns={columns}
      simple
      size="small"
      // rowKey={record => record.transNo}
      dataSource={dataSource}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
