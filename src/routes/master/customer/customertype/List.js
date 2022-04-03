import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.typeName} ?`,
        onOk () {
          deleteItem(record.typeCode)
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'typeCode',
      key: 'typeCode'
    },
    {
      title: 'Name',
      dataIndex: 'typeName',
      key: 'typeName'
    },
    {
      title: 'Discount 01',
      dataIndex: 'discPct01',
      key: 'discPct01'
    },
    {
      title: 'Discount 02',
      dataIndex: 'discPct02',
      key: 'discPct02'
    },
    {
      title: 'Discount 03',
      dataIndex: 'discPct03',
      key: 'discPct03'
    },
    {
      title: 'Discount Nominal',
      dataIndex: 'discNominal',
      key: 'discNominal'
    },
    {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice'
    },
    {
      title: 'Price Add (%)',
      dataIndex: 'distPricePercent',
      key: 'distPricePercent'
    },
    {
      title: 'Show as Discount',
      dataIndex: 'showAsDiscount',
      key: 'showAsDiscount',
      render: text => <Tag color={text ? 'green' : 'red'}>{text ? 'true' : 'false'}</Tag>
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
        scroll={{ x: 1000 }}
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
