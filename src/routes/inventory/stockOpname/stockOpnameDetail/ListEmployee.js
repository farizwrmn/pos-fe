import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const List = ({ editList, ...tableProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      className: styles.alignCenter,
      width: '100px'
    },
    {
      title: 'Employee Code',
      dataIndex: 'user.employeeId',
      key: 'user.employeeId',
      width: '200px'
    },
    {
      title: 'Employee Name',
      dataIndex: 'user.employeeName',
      key: 'user.employeeName',
      width: '200px'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
