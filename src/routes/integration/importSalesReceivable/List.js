import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table } from 'antd'
import { numberFormat } from 'utils'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Sales Name',
      dataIndex: 'salesName',
      key: 'salesName',
      width: '150px'
    },
    {
      title: 'customer',
      dataIndex: 'customer',
      key: 'customer',
      width: '200px'
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '100px'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'Transaction Date',
      key: 'Transaction Date',
      width: '120px',
      render: (text, record) => {
        return (
          <div>
            <div>{record.transDate ? moment(record.transDate).format('DD-MMM-YYYY') : ''}</div>
          </div>
        )
      }
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: '120px',
      render: (text, record) => {
        return (
          <div>
            <div>{record.dueDate ? moment(record.dueDate).format('DD-MM-YYYY HH:mm:ss') : ''}</div>
          </div>
        )
      }
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      width: '120px',
      render: (text) => {
        return (
          <div>
            <div>{(text || '-').toLocaleString()}</div>
          </div>
        )
      }
    },
    {
      title: 'Receivable',
      dataIndex: 'receivable',
      key: 'receivable',
      width: '120px',
      render: (text) => {
        return (
          <div>
            <div>{numberFormatter(text)}</div>
          </div>
        )
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
