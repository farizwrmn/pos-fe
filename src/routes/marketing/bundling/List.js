/* eslint-disable eqeqeq */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { DropOption } from 'components'
import { calendar } from 'utils'
import { IMAGEURL } from 'utils/config.company'
import { withoutFormat } from 'utils/string'
import moment from 'moment'

const { dayByNumber } = calendar

const List = ({ ...tableProps, editItem, voidItem }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      editItem(record)
    } else if (e.key === '2') {
      voidItem(record)
    }
  }

  const columns = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        return text === '0' ? 'Buy X Get Y' : 'Buy X Get Discount Y'
      }
    },
    {
      title: 'Image',
      dataIndex: 'productImage',
      key: 'productImage',
      width: '100px',
      render: (text) => {
        if (text
          && text != null
          && text !== '["no_image.png"]'
          && text !== '"no_image.png"'
          && text !== 'no_image.png') {
          const item = JSON.parse(text)
          if (item && item[0]) {
            return <img height="70px" src={`${IMAGEURL}/${withoutFormat(item[0])}-main.jpg`} alt="no_image" />
          }
        }
        return (<div>No Image</div>)
      }
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Period',
      dataIndex: 'Date',
      key: 'Date',
      render: (text, record) => {
        return `${record.startDate} ~ ${record.endDate}`
      }
    },
    {
      title: 'Available Date',
      dataIndex: 'availableDate',
      key: 'availableDate',
      render: (text) => {
        let date = text !== null ? text.split(',').sort() : <Tag color="green">{'Everyday'}</Tag>
        if (text !== null && (date || []).length === 7) {
          date = <Tag color="green">{'Everyday'}</Tag>
        }
        if (text !== null && (date || []).length < 7) {
          date = date.map(dateNumber => <Tag color="blue">{dayByNumber(dateNumber)}</Tag>)
        }
        return date
      }
    },
    {
      title: 'Available Hour',
      dataIndex: 'availableHour',
      key: 'availableHour',
      render: (text, record) => {
        return `${record.startHour} ~ ${record.endHour}`
      }
    },
    {
      title: 'Publish',
      dataIndex: 'activeShop',
      key: 'activeShop',
      width: 100,
      render: text => (
        <span>
          <Tag color={text == '1' ? 'green' : 'red'}>
            {text == '1' ? 'Published' : 'Offline'}
          </Tag>
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: text => (
        <span>
          <Tag color={text === '1' ? 'green' : 'red'}>
            {text === '1' ? 'Active' : 'Cancelled'}
          </Tag>
        </span>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      render: (text, record) => (
        <span>
          {record.createdBy} ({moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')})
        </span>
      )
    },
    {
      title: 'Updated',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
      render: (text, record) => (
        <span>
          {record.updatedBy} ({moment(record.updatedAt).format('YYYY-MM-DD HH:mm:ss')})
        </span>
      )
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Edit' }, { key: '2', name: 'Void', disabled: record.status === '0' }]} />
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
