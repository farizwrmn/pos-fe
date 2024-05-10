import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { IMAGEURL } from 'utils/config.company'
// import { withoutFormat } from 'utils/string'

const List = (tableProps) => {
  // const column = [
  //   {
  //     title: 'id',
  //     dataIndex: 'id',
  //     key: 'id'
  //   },
  //   {
  //     title: 'No Transaksi DO',
  //     dataIndex: 'transNo',
  //     key: 'transNo'
  //   },
  //   {
  //     title: 'Jumlah MUOUT',
  //     dataIndex: 'totalColly',
  //     key: 'totalColly'
  //   },
  //   {
  //     title: 'Nomor Box',
  //     dataIndex: '',
  //     key: ''
  //   },
  //   {
  //     title: 'Distribution Center',
  //     dataIndex: '',
  //     key: ''
  //   },
  //   {
  //     title: 'Store Name Receiver',
  //     dataIndex: 'storeNameReceiver',
  //     key: 'storeNameReceiver'
  //   },
  //   {
  //     title: 'Tanggal Kirim',
  //     dataIndex: '',
  //     key: ''
  //   },
  //   {
  //     title: 'Durasi',
  //     dataIndex: '',
  //     key: ''
  //   },
  //   {
  //     title: 'Expired DO (Tanggal)',
  //     dataIndex: '',
  //     key: ''
  //   },
  //   {
  //     title: 'Notes',
  //     dataIndex: 'memo',
  //     key: 'memo'
  //   }
  //   // {
  //   //   title: 'Created At',
  //   //   dataIndex: 'createdAt',
  //   //   key: 'createdAt',
  //   //   render: (text, record) => {
  //   //     return (<Link target="_blank" to={`/inventory/transfer/auto-replenish-submission/${record.id}?storeId=${record.storeIdReceiver}`}>{moment(text).format('lll')}</Link>)
  //   //   }
  //   // }
  // ]

  const columns = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   key: 'id'
    // },
    {
      title: 'Image',
      dataIndex: 'productImage',
      key: 'productImage',
      width: '100px',
      render: (text, record) => {
        if (record && record.productImage) {
          const item = JSON.parse(record.productImage)
          if (item && item[0]) {
            return <img height="70px" src={`${IMAGEURL}/${item[0]}`} alt="no_image" />
          }
        }
        return null
      }
    },
    {
      title: 'Delivery Order Quantity',
      dataIndex: 'qty',
      key: 'qty'
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      render (text, record) {
        return {
          props: {
            style: { background: record.color }
          },
          children: (
            <div>
              <div><strong>{record.productCode}</strong></div>
              <div>{record.productName}</div>
              {/* <div>Dimension: {record.dimension} Pack: {record.dimensionPack} Box: {record.dimensionBox}</div> */}
            </div>
          )
        }
      }
    },
    {
      title: 'Brand',
      dataIndex: 'brandName',
      key: 'brandName'
    },
    {
      title: 'categoryName',
      dataIndex: 'categoryName',
      key: 'categoryName'
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
        pagination={false}
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
