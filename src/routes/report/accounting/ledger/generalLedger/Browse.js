/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import { getLinkName } from 'utils/string'

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
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        const link = getLinkName(record.transactionId, record.transNo, record.transactionType)
        return <a target="__blank" href={link}>{text}</a>
      }
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: text => moment(text).format('LL')
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
