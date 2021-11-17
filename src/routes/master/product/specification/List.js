import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import moment from 'moment'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.categoryName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'Category',
      dataIndex: 'categoryCode',
      key: 'categoryCode'
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: '100px'
        },
        {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: '150px',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
        }
      ]
    },
    {
      title: 'Updated',
      children: [
        {
          title: 'By',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: '100px'
        },
        {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: '150px',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
        }
      ]
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
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
