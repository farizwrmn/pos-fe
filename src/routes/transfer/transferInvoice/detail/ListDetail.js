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
      key: 'id'
    },
    {
      title: 'Trans No',
      dataIndex: 'transferOut.transNo',
      key: 'transferOut.transNo'
    },
    {
      title: 'Employee',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Charge (%)',
      dataIndex: 'chargePercent',
      key: 'chargePercent',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Charge (N)',
      dataIndex: 'chargeNominal',
      key: 'chargeNominal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: styles.alignRight,
      render: (text, item) => {
        const total = (item.amount * (1 + (item.chargePercent / 100))) + item.chargeNominal
        return (total || '-').toLocaleString()
      }
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
        footer={() => (
          <div>
            <div>Total : {tableProps.dataSource ? tableProps.dataSource.reduce((cnt, item) => cnt + (parseFloat(item.amount) * (1 + (parseFloat(item.chargePercent) / 100))) + parseFloat(item.chargeNominal) || 0, 0).toLocaleString() : 0}</div>
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
