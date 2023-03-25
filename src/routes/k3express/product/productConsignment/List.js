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
        title: `Are you sure delete ${record.productName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Image',
      dataIndex: 'productImage',
      key: 'productImage',
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
      title: 'Express Category',
      dataIndex: 'expressCategoryName',
      key: 'expressCategoryName'
    },
    {
      title: 'Express Brand',
      dataIndex: 'expressBrandName',
      key: 'expressBrandName'
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
