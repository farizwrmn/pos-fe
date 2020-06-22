/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table } from 'antd'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ dataSource, activeKey, ...browseProps }) => {
  let columns = [
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: '20%'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: text => moment(text).format('LL'),
      width: '20%'
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: text => (
        <div>
          {formatNumberIndonesia(parseFloat(text || 0))}
        </div>
      ),
      width: '30%'
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: text => (
        <div>
          {formatNumberIndonesia(parseFloat(text || 0))}
        </div>
      ),
      width: '30%'
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      simple
      size="small"
      dataSource={dataSource}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
