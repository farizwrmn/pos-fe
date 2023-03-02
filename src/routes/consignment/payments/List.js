import React from 'react'
import PropTypes from 'prop-types'
import { Col, Modal, Table } from 'antd'
import { DropOption } from 'components'

const listColumnProps = {
  xs: 24,
  sm: 24,
  md: 16,
  lg: 16,
  xl: 16
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
      width: 50,
      render: (_, record) => <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete', disabled: false }]} />
    },
    {
      title: 'Code',
      dataIndex: 'typeCode',
      key: 'typeCode',
      width: 50,
      render: value => <div style={{ textAlign: 'center' }}>{value}</div>
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
      width: 70,
      render: value => <div style={{ textAlign: 'center' }}>{`${value} %`}</div>
    },
    {
      title: 'Fee Non Food',
      dataIndex: 'fee_non_food',
      key: 'fee_non_food',
      width: 110,
      render: value => <div style={{ textAlign: 'center' }}>{`${value} %`}</div>
    }
  ]

  return (
    <Col {...listColumnProps}>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 450 }}
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
