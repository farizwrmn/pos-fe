import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = (tableProps) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'CODE',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'NAME',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'TAG',
      dataIndex: 'productTag',
      key: 'productTag'
    },
    {
      title: 'Min Dis',
      dataIndex: 'minDisp',
      key: 'minDisp'
    },
    {
      title: 'Minor',
      dataIndex: 'minor',
      key: 'minor'
    },
    {
      title: 'Sales',
      children: [
        {
          title: 'ini',
          dataIndex: 'salesCurrentMonth',
          key: 'salesCurrentMonth'
        },
        {
          title: '-1',
          dataIndex: 'salesTwoMonth',
          key: 'salesTwoMonth'
        },
        {
          title: '-2',
          dataIndex: 'salesThreeMonth',
          key: 'salesThreeMonth'
        }
      ]
    },
    {
      title: 'Avg Sales / Day',
      dataIndex: 'avgSales',
      key: 'avgSales'
    },
    {
      title: 'MPKM',
      dataIndex: 'mpkm',
      key: 'mpkm'
    },
    {
      title: 'PKM',
      dataIndex: 'pkm',
      key: 'pkm'
    },
    {
      title: 'N+',
      dataIndex: 'nPlus',
      key: 'nPlus'
    },
    {
      title: 'Nx',
      dataIndex: 'nCross',
      key: 'nCross'
    },
    {
      title: 'PKM EXISTS',
      dataIndex: 'pkmExists',
      key: 'pkmExists'
    },
    {
      title: 'Stock',
      dataIndex: 'stockQty',
      key: 'stockQty'
    },
    {
      title: 'OOS Day',
      children: [
        {
          title: 'ini',
          dataIndex: 'oosCurrentMonth',
          key: 'oosCurrentMonth'
        },
        {
          title: '-1',
          dataIndex: 'oosTwoMonth',
          key: 'oosTwoMonth'
        },
        {
          title: '-2',
          dataIndex: 'oosThreeMonth',
          key: 'oosThreeMonth'
        }
      ]
    },
    {
      title: 'DSI PKM',
      dataIndex: 'dsiPkm',
      key: 'dsiPkm'
    },
    {
      title: 'DSI OH',
      dataIndex: 'dsiOnHand',
      key: 'dsiOnHand'
    },
    {
      title: 'Turnover',
      dataIndex: 'turnover',
      key: 'turnover'
    },
    {
      title: 'Effective Stock',
      dataIndex: 'effectiveStock',
      key: 'effectiveStock'
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
