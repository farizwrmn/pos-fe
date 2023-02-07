import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormatter } from 'utils/numberFormat'
import styles from '../../../../themes/index.less'

const List = ({ editList, ...tableProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      className: styles.alignCenter,
      width: '80px'
    },
    {
      title: 'Employee Code',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: '100px'
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: '150px'
    },
    {
      title: 'Remain Item',
      dataIndex: 'total',
      key: 'total',
      width: '60px',
      render: (text) => {
        return numberFormatter(text)
      }
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
