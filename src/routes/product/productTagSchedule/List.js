import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ editItem, deleteItem, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure to delete this record ?',
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Tag',
      dataIndex: 'tagCode',
      key: 'tagCode'
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Period',
      dataIndex: 'Date',
      key: 'Date',
      render: (text, record) => {
        return `${moment(record.scheduleExecuteStart, 'YYYY-MM-DD').format('DD-MMM-YYYY')} ~ ${moment(record.scheduleExecuteEnd, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`
      }
    },
    {
      title: 'Start',
      dataIndex: 'executedStart',
      key: 'executedStart'
    },
    {
      title: 'End',
      dataIndex: 'executedEnd',
      key: 'executedEnd'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '2', name: 'Delete' }]} />
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
