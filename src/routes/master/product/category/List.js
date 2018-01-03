import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.categoryName} ?`,
        onOk () {
          deleteItem(record.categoryCode)
        },
      })
    }
  }

  const columns = [
    {
      title: 'Code',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
    },
    {
      title: 'Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Image',
      dataIndex: 'categoryImage',
      key: 'categoryImage',
    },
    {
      title: 'Parent Category',
      dataIndex: 'categoryParentId',
      key: 'categoryParentId',
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
        },
        {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
        },
      ],
    },
    {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
        },
        {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
        },
      ],
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete' }]} />
      },
    },
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1400 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func,
}

export default List
