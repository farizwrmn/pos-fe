import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../themes/index.less'

const Browse = ({
  handleModalShowList, listItem, ...purchaseProps }) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Trans No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName'
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
    }
  ]

  const hdlModalShow = (record) => {
    handleModalShowList(record)
  }

  return (
    <Table
      {...purchaseProps}
      bordered={false}
      scroll={{ x: 1000 }}
      columns={columns}
      simple
      size="small"
      pagination={{ pageSize: 5 }}
      onRowClick={_record => hdlModalShow(_record)}
      footer={() => (
        <div>
          <div>Debit : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amountIn || 0), 0).toLocaleString()}</div>
          <div>Credit : {listItem.reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0).toLocaleString()}</div>
        </div>)
      }
    />
  )
}

Browse.propTypes = {
  modalShow: PropTypes.func
}

export default Browse
