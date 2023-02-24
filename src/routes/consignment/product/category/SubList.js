import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Table } from 'antd'

const List = ({ ...tableProps, list, showModalForm }) => {
  const handleMenuClick = (record) => {
    showModalForm({ value: { id: record.id, name: record.name, mainName: record.category_id }, type: 'sub' })
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
      dataIndex: 'category_id',
      key: 'category_id',
      render: (value) => {
        const category = list.filter(filtered => filtered.id === value)
        if (category && category[0]) {
          return category[0].name
        }
      }
    },
    {
      title: 'Sub Kategori',
      dataIndex: 'name',
      key: 'name'
    }
  ]

  return (
    <div>
      <Button onClick={() => showModalForm({ value: null, type: 'sub' })} type="primary" style={{ marginBottom: '10px' }}>
        Tambah Sub-Category
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
