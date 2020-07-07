/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'User Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: '175px',
      render: (text, record) => {
        if (record.balance) {
          return (
            <div>
              <div>{`User: ${record.balance && record.balance.balanceUser ? record.balance.balanceUser.fullName : record.balance.userId}`}</div>
              <div>{`ApproveBy: ${record.balance && record.balance.balanceApprove ? record.balance.balanceApprove.fullName : record.balance.approveUserId}`}</div>
            </div>
          )
        }
        return ''
      }
    },
    {
      title: 'Invoice',
      dataIndex: 'pos.transNo',
      key: 'pos.transNo',
      width: '155px',
      render: (text, record) => {
        if (record.pos) {
          return (
            <div>
              <div>{`Trans No: ${record.pos.transNo}`}</div>
              <div>{`Trans Date: ${moment(record.pos.transDate).format('DD-MMM-YYYY')}`}</div>
              <div>{`Employee: ${record.pos.technicianId}`}</div>
              <div>
                {'Status: '}
                {<Tag color={record.pos.status === 'A' ? 'blue' : record.pos.status === 'C' ? 'red' : 'green'}>
                  {record.pos.status === 'A' ? 'Active' : record.pos.status === 'C' ? 'Canceled' : 'Non-Active'}
                </Tag>}
              </div>
              <div>{`Memo: ${record.pos.memo || ''}`}</div>
            </div>
          )
        }
        return ''
      }
    },
    {
      title: 'Payment',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: '175px',
      render: (text, record) => {
        return (
          <div>
            <div>{`Type Code: ${record.cost && record.cost.costBank ? record.cost.costBank.bankName : record.typeCode}`}</div>
            <div>{`Charge: ${formatNumberIndonesia(record.chargeTotal)}`}</div>
            <div>{`Amount: ${formatNumberIndonesia(record.amount)}`}</div>
            <div>{`Memo: ${record.description || ''}`}</div>
          </div>
        )
      }
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      scroll={{ x: 1000, y: 300 }}
      columns={columns}
      simple
      size="small"
      rowKey={record => record.transNo}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
