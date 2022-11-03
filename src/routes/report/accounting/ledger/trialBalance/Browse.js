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
      title: 'Start',
      dataIndex: 'startBalance',
      key: 'startBalance',
      children: [
        {
          title: 'Debit',
          dataIndex: 'startBalanceDebit',
          key: 'startBalanceDebit',
          render: (text, record) => {
            if (record.startBalance > 0) {
              return (
                <div>
                  {formatNumberIndonesia(parseFloat(record.startBalance || 0))}
                </div>
              )
            }
            return '-'
          }
        },
        {
          title: 'Credit',
          dataIndex: 'startBalanceCredit',
          key: 'startBalanceCredit',
          render: (text, record) => {
            if (record.startBalance < 0) {
              return (
                <div>
                  {formatNumberIndonesia(parseFloat(record.startBalance || 0) * -1)}
                </div>
              )
            }
            return '-'
          }
        }
      ]
    },
    {
      title: 'Moving',
      dataIndex: 'movingBalance',
      key: 'movingBalance',
      children: [
        {
          title: 'Debit',
          dataIndex: 'movingBalanceDebit',
          key: 'movingBalanceDebit',
          render: (text, record) => {
            if (record.movingBalance > 0) {
              return (
                <div>
                  {formatNumberIndonesia(parseFloat(record.movingBalance || 0))}
                </div>
              )
            }
            return '-'
          }
        },
        {
          title: 'Credit',
          dataIndex: 'movingBalanceCredit',
          key: 'movingBalanceCredit',
          render: (text, record) => {
            if (record.movingBalance < 0) {
              return (
                <div>
                  {formatNumberIndonesia(parseFloat(record.movingBalance || 0) * -1)}
                </div>
              )
            }
            return '-'
          }
        }
      ]
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      children: [
        {
          title: 'Debit',
          dataIndex: 'balanceDebit',
          key: 'balanceDebit',
          render: (text, record) => {
            if (record.balance > 0) {
              return (
                <div>
                  {formatNumberIndonesia(parseFloat(record.balance || 0))}
                </div>
              )
            }
            return '-'
          }
        },
        {
          title: 'Credit',
          dataIndex: 'balanceCredit',
          key: 'balanceCredit',
          render: (text, record) => {
            if (record.balance < 0) {
              return (
                <div>
                  {formatNumberIndonesia(parseFloat(record.balance || 0) * -1)}
                </div>
              )
            }
            return '-'
          }
        }
      ]
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
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
