import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table } from 'antd'
import { DropOption } from 'components'

// const confirm = Modal.confirm

const List = ({
  editItem,
  deleteItem,
  listItem,
  ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    }
  }

  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference'
    },
    {
      title: 'Desc',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      sorter: (a, b) => moment.utc(a.transDate, 'YYYY/MM/DD') - moment.utc(b.transDate, 'YYYY/MM/DD'),
      render: _text => `${_text ? moment(_text).format('DD-MMM-YYYY') : '-'}`
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
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
        footer={() => (
          <div>
            <div>Debit : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amountIn || 0), 0).toLocaleString()}</div>
            <div>Credit : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0).toLocaleString()}</div>
          </div>)
        }
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
