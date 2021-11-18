import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import { numberFormatter } from 'utils/numberFormat'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.voucherName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Code',
      dataIndex: 'voucherCode',
      key: 'voucherCode',
      render: (text, record) => <Link to={`/marketing/voucher/${encodeURIComponent(record.id)}`}>{text}</Link>
    },
    {
      title: 'Voucher Name',
      dataIndex: 'voucherName',
      key: 'voucherName'
    },
    {
      title: 'Count',
      dataIndex: 'voucherCount',
      key: 'voucherCount',
      render: text => numberFormatter(text)
    },
    {
      title: 'Expire Date',
      dataIndex: 'expireDate',
      key: 'expireDate'
    },
    {
      title: 'Value',
      dataIndex: 'voucherValue',
      key: 'voucherValue',
      render: text => numberFormatter(text)
    },
    {
      title: 'Price',
      dataIndex: 'voucherPrice',
      key: 'voucherPrice',
      render: text => numberFormatter(text)
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text) => {
        if (text) {
          return (
            <Tag color="green">
              Active
            </Tag>
          )
        }
        return (
          <Tag color="red">
            Non Active
          </Tag>
        )
      }
    },
    {
      title: 'Sold Out',
      dataIndex: 'soldOut',
      key: 'soldOut',
      render: (text) => {
        if (text) {
          return (
            <Tag color="red">
              Sold Out
            </Tag>
          )
        }
        return (
          <Tag color="green">
            Available
          </Tag>
        )
      }
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
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
