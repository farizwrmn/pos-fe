/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import moment from 'moment'

const Browse = ({ ...browseProps }) => {
  const columns = [
    {
      title: 'storeName',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Employee Name',
      dataIndex: 'employee.employeeName',
      key: 'employee.employeeName'
    },
    {
      title: 'Bank Name',
      dataIndex: 'employee.bankName',
      key: 'employee.bankName'
    },
    {
      title: 'Account No',
      dataIndex: 'employee.accountNo',
      key: 'employee.accountNo'
    },
    {
      title: 'Account Name',
      dataIndex: 'employee.accountName',
      key: 'employee.accountName'
    },
    {
      title: 'Login At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).format('lll')
    }
  ]

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      simple
      size="small"
      rowKey={record => record.transNo}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
