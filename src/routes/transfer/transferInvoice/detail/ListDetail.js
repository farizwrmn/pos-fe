import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import styles from '../../../../themes/index.less'

const List = ({ ...tableProps, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
      key: 'id'
    },
    {
      title: 'Trans No',
      width: 200,
      dataIndex: 'transferOut.transNo',
      key: 'transferOut.transNo'
    },
    {
      title: 'Employee',
      width: 100,
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Amount',
      width: 100,
      dataIndex: 'amountTransfer',
      key: 'amountTransfer',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Charge (%)',
      width: 100,
      dataIndex: 'chargePercent',
      key: 'chargePercent',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Charge (N)',
      width: 100,
      dataIndex: 'chargeNominal',
      key: 'chargeNominal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Total',
      width: 100,
      dataIndex: 'total',
      key: 'total',
      className: styles.alignRight,
      render: (text, item) => {
        const total = (item.amountTransfer * (1 + (item.chargePercent / 100))) + item.chargeNominal
        return (total || '-').toLocaleString()
      }
    },
    {
      title: 'Memo',
      width: 150,
      dataIndex: 'memo',
      key: 'memo'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 700, y: 500 }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
        footer={() => (
          <div>
            <div>Total : {tableProps.dataSource ? tableProps.dataSource.reduce((cnt, item) => cnt + (parseFloat(item.amountTransfer) * (1 + (parseFloat(item.chargePercent) / 100))) + parseFloat(item.chargeNominal) || 0, 0).toLocaleString() : 0}</div>
          </div>)
        }
      />
    </div>
  )
}

List.propTypes = {
  editList: PropTypes.func
}

export default List
