import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const { numberFormatter } = numberFormat

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '75px',
      sorter: (a, b) => moment.utc(a.transDate, 'YYYY-MM-DD') - moment.utc(b.transDate, 'YYYY-MM-DD'),
      render: text => <p style={{ textAlign: 'left' }}>{moment(text).format('DD-MMM-YYYY')}</p>
    },
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '100px'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '150px',
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
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      width: '150px',
      render: (text) => {
        if (text && text.length > 0) {
          return (
            <div>
              <div>Machine: {text[0].paymentMachine ? text[0].paymentMachine.name : 'CASH'}</div>
            </div>
          )
        }
        return (
          <div>
            <div>PENDING</div>
          </div>
        )
      }
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: '50px',
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text)}</p>
    },
    {
      title: 'Total',
      dataIndex: 'netto',
      key: 'netto',
      width: '50px',
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text)}</p>
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: 475 }}
      columns={columns}
      simple
      size="small"
    />
  )
}

export default Browse
