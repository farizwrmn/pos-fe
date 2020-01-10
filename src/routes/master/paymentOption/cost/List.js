import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Modal } from 'antd'
import { DropOption } from 'components'
import { discountFormatter, currencyFormatter } from 'utils/string'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.counterName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }
  const columns = [
    {
      title: 'Bank',
      dataIndex: 'bankCode',
      key: 'bankCode',
      render: (text, data) => {
        return (
          <div>
            <div>Code: {data.bankCode}</div>
            <div>Name: {data.bankName}</div>
          </div>
        )
      }
    },
    {
      title: 'Charge',
      dataIndex: 'chargeNominal',
      key: 'chargeNominal',
      render: (text, data) => {
        return (
          <div>
            <div>Charge(N): {currencyFormatter(data.chargeNominal)}</div>
            <div>Charge(%): {discountFormatter(data.chargePercent)}</div>
          </div>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text =>
        (<span>
          <Tag color={text ? 'blue' : 'red'}>
            {text ? 'Active' : 'Disabled'}
          </Tag>
        </span>)
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Edit' },
              { key: '2', name: 'Delete' }
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
