/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ dataSource, activeKey, ...browseProps }) => {
  let columns = [
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      key: 'accountCode'
    },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName'
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: text => (
        <div>
          {formatNumberIndonesia(parseFloat(text || 0))}
        </div>
      )
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: text => (
        <div>
          {formatNumberIndonesia(parseFloat(text || 0))}
        </div>
      )
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      pagination={false}
      columns={columns}
      simple
      size="small"
      dataSource={dataSource}
      footer={() => (
        <div>
          <div>Debit : {dataSource.reduce((cnt, o) => cnt + parseFloat(o.debit || 0), 0).toLocaleString()}</div>
          <div>Credit : {dataSource.reduce((cnt, o) => cnt + parseFloat(o.credit || 0), 0).toLocaleString()}</div>
          <div>Balance : {dataSource.reduce((cnt, o) => cnt + (parseFloat(o.debit || 0) - parseFloat(o.credit || 0)), 0).toLocaleString()}</div>
        </div>)
      }
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
