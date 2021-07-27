import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { IMAGEURL } from 'utils/config.company'
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
          deleteItem(record.categoryCode)
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
          console.log('text', text)
          const item = JSON.parse(text)
          if (item && item[0]) {
            return <img height="70px" src={`${IMAGEURL}/${item[0]}`} alt="no_image" />
          }
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
      title: 'Created',
      children: [
        {
          title: 'By',
          dataIndex: 'createdBy',
          key: 'createdBy'
        },
        {
          title: 'Time',
          dataIndex: 'createdAt',
          key: 'createdAt',
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
          key: 'updatedBy'
        },
        {
          title: 'Time',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          render: text => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '')
        }
      ]
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
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
        scroll={{ x: 1400 }}
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
