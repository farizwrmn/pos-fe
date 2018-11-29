import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Modal, Tag } from 'antd'
import { DropOption } from 'components'
import ReactHtmlParser from 'react-html-parser'

const confirm = Modal.confirm

const List = ({ ...tableProps, editItem, deleteItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete ${record.counterName} ?`,
        onOk () {
          deleteItem(record.id)
        }
      })
    }
  }

  const columns = [
    // {
    //   title: 'Image',
    //   dataIndex: 'image',
    //   key: 'image',
    //   render: text => <img src={text} alt="" width="48" />
    // },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
      render: text => <div>{ReactHtmlParser(text)}</div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = ''
        let value = ''
        switch (text) {
          case '1': {
            color = 'green'
            value = 'Publish'
            break
          }
          case '2': {
            color = 'yellow'
            value = 'Pending'
            break
          }
          case '3': {
            color = 'red'
            value = 'Non-active'
            break
          }
          default: {
            color = 'yellow'
            value = 'Pending'
            break
          }
        }
        return (
          <Tag color={color}>
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'CreatedBy',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).format('DD-MMM-YYYY hh:mm:ss')
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
