import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const List = ({ tmpListProduct, onOpenModalPkm, ...tableProps }) => {
  console.log('List', [...new Set(tmpListProduct.map(item => item.productTag))])
  const listProductTag = tmpListProduct && tmpListProduct.length > 0
    ? [...new Set(tmpListProduct.map(item => item.productTag))]
      .map(item => ({ text: item, value: item }))
    : [{
      text: 'F',
      value: 'S'
    }, {
      text: 'S',
      value: 'S'
    }]
  const columns = [
    {
      title: 'ID',
      dataIndex: 'productId',
      width: 70,
      key: 'productId'
    },
    {
      title: 'CODE',
      dataIndex: 'productCode',
      width: 110,
      key: 'productCode'
    },
    {
      title: 'NAME',
      dataIndex: 'productName',
      width: 230,
      key: 'productName'
    },
    {
      title: 'TAG',
      dataIndex: 'productTag',
      width: 80,
      key: 'productTag',
      filters: listProductTag,
      onFilter: (value, record) => record.productTag.indexOf(value) === 0,
      sorter: (a, b) => a.productTag.length - b.productTag.length
    },
    {
      title: 'Minor',
      dataIndex: 'minor',
      width: 70,
      key: 'minor',
      sorter: (a, b) => a.minor.length - b.minor.length
    },
    {
      title: 'Sales',
      width: 90,
      children: [
        {
          title: 'ini',
          dataIndex: 'salesCurrentMonth',
          width: 30,
          key: 'salesCurrentMonth'
        },
        {
          title: '-1',
          dataIndex: 'salesTwoMonth',
          width: 30,
          key: 'salesTwoMonth'
        },
        {
          title: '-2',
          dataIndex: 'salesThreeMonth',
          width: 30,
          key: 'salesThreeMonth'
        }
      ]
    },
    {
      title: 'Avg Sales / Day',
      dataIndex: 'avgSales',
      width: 120,
      key: 'avgSales',
      sorter: (a, b) => a.avgSales - b.avgSales
    },
    {
      title: 'MPKM',
      dataIndex: 'mpkm',
      width: 80,
      key: 'mpkm',
      sorter: (a, b) => a.mpkm - b.mpkm
    },
    {
      title: 'PKM',
      dataIndex: 'pkm',
      width: 80,
      key: 'pkm',
      sorter: (a, b) => a.mpkm - b.mpkm,
      render: (text, record) => {
        return <div style={{ color: '#55a756', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => onOpenModalPkm(record)}>{text}</div>
      }
    },
    {
      title: 'N+',
      dataIndex: 'nPlus',
      width: 60,
      key: 'nPlus',
      sorter: (a, b) => a.nPlus - b.nPlus
    },
    {
      title: 'Nx',
      dataIndex: 'nCross',
      width: 60,
      key: 'nCross',
      sorter: (a, b) => a.nCross - b.nCross
    },
    {
      title: 'PKM EXISTS',
      dataIndex: 'pkmExists',
      width: 100,
      key: 'pkmExists'
    },
    {
      title: 'Stock',
      dataIndex: 'stockQty',
      width: 60,
      key: 'stockQty'
    },
    {
      title: 'OOS Day',
      width: 90,
      children: [
        {
          title: 'ini',
          dataIndex: 'oosCurrentMonth',
          width: 30,
          key: 'oosCurrentMonth'
        },
        {
          title: '-1',
          dataIndex: 'oosTwoMonth',
          width: 30,
          key: 'oosTwoMonth'
        },
        {
          title: '-2',
          dataIndex: 'oosThreeMonth',
          width: 30,
          key: 'oosThreeMonth'
        }
      ]
    },
    {
      title: 'DSI PKM',
      dataIndex: 'dsiPkm',
      width: 100,
      key: 'dsiPkm',
      sorter: (a, b) => a.dsiOnHand - b.dsiOnHand
    },
    {
      title: 'DSI OH',
      dataIndex: 'dsiOnHand',
      width: 100,
      key: 'dsiOnHand',
      sorter: (a, b) => a.dsiOnHand - b.dsiOnHand
    },
    {
      title: 'Turnover',
      dataIndex: 'turnover',
      width: 60,
      key: 'turnover'
    },
    {
      title: 'Effective Stock',
      dataIndex: 'effectiveStock',
      width: 120,
      key: 'effectiveStock'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000, y: 400 }}
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
