/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const Browse = ({ listStoreLov, ...browseProps }) => {
  const columns = ([
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Cost',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render: text => (text || '-').toLocaleString()
    }
  ])
    .concat(listStoreLov
      .filter(filtered => !filtered.storeName.includes('FK'))
      .map(item => ({
        title: item.storeName,
        dataIndex: item.storeCode,
        key: item.storeCode,
        render: (text, record) => {
          const count = record.listStore.filter(filtered => filtered.storeId === item.id).reduce((prev, next) => prev + (!next.countSales ? (next.countIn - next.countOut) : 0), 0)
          const countSales = record.listStore.filter(filtered => filtered.storeId === item.id).reduce((prev, next) => prev + (next.countSales || 0), 0)
          return `${(count || '-').toLocaleString()}; Sales: ${(countSales || '-').toLocaleString()}`
        }
      })))

  return (
    <Table
      {...browseProps}
      bordered
      columns={columns}
      scroll={{
        x: 1500
      }}
      simple
      size="small"
      pagination={false}
      rowKey={record => record.transNo}
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
