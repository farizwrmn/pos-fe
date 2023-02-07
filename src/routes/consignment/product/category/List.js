import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Table } from 'antd'

const List = ({ ...tableProps, showModalForm }) => {
  const handleMenuClick = (record) => {
    showModalForm({ value: { id: record.id, name: record.name }, type: 'main' })
  }

  const columns = [
    {
      title: 'Action',
      width: 100,
      render: (record) => {
        return (
          <Row type="flex" justify="center">
            <Button type="primary" onClick={() => handleMenuClick(record)}>Edit</Button>
          </Row>
        )
      }
    },
    {
      title: 'Kategori',
      dataIndex: 'name',
      key: 'name'
    }
  ]

  return (
    <div>
      <Button onClick={() => showModalForm({ value: null, type: 'main' })} type="primary" style={{ marginBottom: '10px' }}>
        Tambah Kategori
      </Button>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 400 }}
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
