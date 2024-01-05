import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { Link } from 'dva/router'


const List = (tableProps) => {
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        return (<Link target="_blank" to={`/delivery-order-detail/${record.id}?storeId=${record.storeIdReceiver}`}>{text}</Link>)
      }
    },
    {
      title: 'No Transaksi DO',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Jumlah MUOUT (Angka)',
      dataIndex: 'totalColly',
      key: 'totalColly'
    },
    {
      title: 'Store Name Receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Notes',
      dataIndex: 'memo',
      key: 'memo'
    },
    {
      title: 'Hari Tanggal Jam',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Distribution Center',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Durasi DO (Count Hari)',
      dataIndex: '',
      key: ''
    },
    {
      title: 'Expired DO (Tanggal)',
      dataIndex: '',
      key: ''
    }
    // {
    //   title: 'Created At',
    //   dataIndex: 'createdAt',
    //   key: 'createdAt',
    //   render: (text, record) => {
    //     return (<Link target="_blank" to={`/inventory/transfer/auto-replenish-submission/${record.id}?storeId=${record.storeIdReceiver}`}>{moment(text).format('lll')}</Link>)
    //   }
    // }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        columns={columns}
        pagination={false}
        simple
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
