import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { numberFormat } from 'utils'
import moment from 'moment'

const numberFormatter = numberFormat.numberFormatter

const confirm = Modal.confirm

const List = ({ ...tableProps,
  editItem,
  deleteItem
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.salesName} - ${record.customer} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        return (
          <div>
            <div>{record.id}</div>
          </div>
        )
      }
    },
    {
      title: 'Sales Name',
      dataIndex: 'salesName',
      key: 'salesName'
    },
    {
      title: 'customer',
      dataIndex: 'customer',
      key: 'customer'
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'Transaction Date',
      key: 'Transaction Date',
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
      render: (text) => {
        return (
          <div>
            <div>{numberFormatter(text)}</div>
          </div>
        )
      }
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Delete', disabled: false }
            ]}
          />
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
