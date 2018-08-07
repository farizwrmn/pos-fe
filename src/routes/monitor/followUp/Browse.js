import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { DropOption } from 'components'
import { formatDate } from 'utils'
import styles from '../../../themes/index.less'

const List = ({ ...tableProps, updateHeaderStatus }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      updateHeaderStatus(record.posId)
    }
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: text => (text === 'M' ? 'Male' : 'Female')
    },
    {
      title: 'Period',
      dataIndex: 'transDate',
      key: 'transDate',
      render: text => formatDate(text)
    },
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        switch (text) {
          case '0':
            return 'Not Called'
          case '1':
            return 'Called'
          case '2':
            return 'In Progress'
          case '3':
            return 'Pending'
          case '4':
            return 'Never'
          default:
            break
        }
      }
    },
    {
      title: 'Store',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      className: styles.alignCenter,
      render: (text, record) => {
        return (<DropOption onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: 'View', icon: 'eye-o' }
          ]}
        />)
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
  view: PropTypes.func
}

export default List
