import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import moment from 'moment'
import { numberFormat } from 'utils'

const numberFormatter = numberFormat.numberFormatter

const List = ({ ...tableProps }) => {
  const handleMenuClick = () => {
    // editList(record)
  }

  const columns = [
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo',
      width: 150
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 120,
      render: text =>
      (<span>
        <Tag color={parseInt(text, 10) ? 'blue' : 'red'}>
          {parseInt(text, 10) ? 'Active' : 'Canceled'}
        </Tag>
      </span>)
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 120,
      render: _text => `${moment(_text).format('LL')}`
    },
    {
      title: 'Time',
      dataIndex: 'transTime',
      key: 'transTime',
      width: 120
    },
    {
      title: 'Type Code',
      dataIndex: 'typeCode',
      key: 'typeCode',
      width: 100
    },
    {
      title: 'Amount',
      dataIndex: 'paid',
      key: 'paid',
      width: 120,
      render: text => <p style={{ textAlign: 'right' }}>{numberFormatter(text || 0)}</p>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 120,
      render: text => <p style={{ textAlign: 'left' }}>{text}</p>
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
