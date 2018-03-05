import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = ({ ...tableProps, dataSource }) => {
  const columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode'
    },
    {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName'
    },
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => {
        return (text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
      }
    },
    {
      title: 'Total Discount',
      dataIndex: 'totalDiscount',
      key: 'totalDiscount',
      render: (text) => {
        return (text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
      }
    },
    {
      title: 'Netto Total',
      dataIndex: 'nettoTotal',
      key: 'nettoTotal',
      render: (text) => {
        return (text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
      }
    }
  ]

  const totalPrice = dataSource.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal), 0)

  return (
    <div>
      <Table {...tableProps}
        bordered
        scroll={{ x: 1300 }}
        columns={columns}
        simple
        footer={() => `Total Asset: ${totalPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  dataSource: PropTypes.array
}

export default List

