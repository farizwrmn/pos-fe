import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { IMAGEURL } from 'utils/config.company'
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
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'categoryCode',
      key: 'categoryCode'
    },
    {
      title: 'Name',
      dataIndex: 'categoryName',
      key: 'categoryName'
    },
    {
      title: 'Image',
      dataIndex: 'categoryImage',
      key: 'categoryImage',
      width: '100px',
      render: (text) => {
        if (text
          && text != null
          && text !== '"no_image.png"'
          && text !== 'no_image.png') {
          return <img height="70px" src={`${IMAGEURL}/${text}`} alt="no_image" />
        }
        return null
      }
    },
    {
      title: 'Parent Category',
      dataIndex: 'categoryParentName',
      key: 'categoryParentName'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Delete', disabled: false }]} />
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
