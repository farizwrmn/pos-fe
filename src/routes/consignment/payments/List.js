import React from 'react'
import PropTypes from 'prop-types'
import { Col, Modal, Table } from 'antd'
import { DropOption } from 'components'

const listColumn = {
  xs: 24,
  sm: 24,
  md: 12
}

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, event) => {
    if (event.key === '1') {
      Modal.confirm({
        title: 'Edit Payment',
        content: 'Are you sure to edit this payment?',
        onOk () {
          editItem(record)
        },
        onCancel () {

        }
      })
    } else {
      deleteItem(record.id)
    }
  }

  const columns = [
    {
      title: 'Action',
      width: '50px',
      render: (_, record) => <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete', disabled: false }]} />
    },
    {
      title: 'Code',
      dataIndex: 'typeCode',
      key: 'typeCode'
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method'
    },
    {
      title: 'Fee Food',
      dataIndex: 'fee_food',
      key: 'fee_food',
      render: value => `${value} %`
    },
    {
      title: 'Fee Non Food',
      dataIndex: 'fee_non_food',
      key: 'fee_non_food',
      render: value => `${value} %`
    }
  ]

  return (
    <Col {...listColumn}>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 600 }}
        rowKey={record => record.id}
      />
    </Col>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
