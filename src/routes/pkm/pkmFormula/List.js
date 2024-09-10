import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { lstorage } from 'utils'

const List = ({ tmpListProduct, onOpenModalPkm, onOpenModalMinor, ...tableProps }) => {
  let defaultRole = (lstorage.getStorageKey('udi')[2] || '')

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
      sorter: (a, b) => a.minor - b.minor,
      render: (text, record) => {
        if (defaultRole === 'AWR'
          || defaultRole === 'HWR'
          || defaultRole === 'OWN'
          || defaultRole === 'HPC'
          || defaultRole === 'SPC'
          || defaultRole === 'PCS'
        ) {
          return <div style={{ color: '#55a756', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => onOpenModalMinor(record)}>{text}</div>
        }
        return text
      }
    },
    {
      title: 'Sales',
      width: 150,
      children: [
        {
          title: 'ini',
          dataIndex: 'salesCurrentMonth',
          width: 50,
          key: 'salesCurrentMonth'
        },
        {
          title: '-1',
          dataIndex: 'salesTwoMonth',
          width: 50,
          key: 'salesTwoMonth'
        },
        {
          title: '-2',
          dataIndex: 'salesThreeMonth',
          width: 50,
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
      sorter: (a, b) => a.pkm - b.pkm,
      render: (text, record) => {
        if (defaultRole === 'CAP'
          || defaultRole === 'OWN'
        ) {
          return <div style={{ color: '#55a756', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => onOpenModalPkm(record)}>{text}</div>
        }
        return text
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
      width: 150,
      children: [
        {
          title: 'ini',
          dataIndex: 'oosCurrentMonth',
          width: 50,
          key: 'oosCurrentMonth'
        },
        {
          title: '-1',
          dataIndex: 'oosTwoMonth',
          width: 50,
          key: 'oosTwoMonth'
        },
        {
          title: '-2',
          dataIndex: 'oosThreeMonth',
          width: 50,
          key: 'oosThreeMonth'
        }
      ]
    },
    {
      title: 'DSI PKM',
      dataIndex: 'dsiPkm',
      width: 100,
      key: 'dsiPkm',
      sorter: (a, b) => a.dsiPkm - b.dsiPkm
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
