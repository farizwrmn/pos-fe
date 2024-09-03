import React from 'react'
import PropTypes from 'prop-types'
// import { DropOption } from 'components'
import {
  Table
  // Icon,
  // Tag
} from 'antd'
import { numberFormat } from 'utils'

const numberFormatter = numberFormat.numberFormatter

const List = (tableProps) => {
  // const hdlDropOptionClick = (record, e) => {
  //   if (e.key === '1') {
  //     cancelPayment(record)
  //   }
  // }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: 'Code',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 80
    },
    {
      title: 'Name',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 120
    },
    {
      title: 'Trans Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 60
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      width: 60,
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text)}</p>
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      width: 60,
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text)}</p>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 100,
      render: text => <p style={{ textAlign: 'left' }}>{text}</p>
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 700, y: 700 }}
        columns={columns}
        simple
        rowKey={record => record.no}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func,
  cancelPayment: PropTypes.func.isRequired
}

export default List
