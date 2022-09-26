import React from 'react'
// import { connect } from 'dva'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Button } from 'antd'

const ListTransfer = (tableProps) => {
  const columns = [
    {
      title: 'Tanggal kirim',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text, record) => {
        const then = moment(record.transDate).format('dddd, DD-MM-YYYY')
        return <div>{then}</div>
      }
    },
    {
      title: 'Durasi',
      dataIndex: 'duration',
      key: 'duration',
      render: (text, record) => {
        const then = moment(record.transDate).format('dddd, DD-MM-YYYY')
        let now = moment().format('DD/MM/YYYY HH:mm:ss')
        let duration = moment(moment(now, 'DD/MM/YYYY HH:mm:ss')).diff(moment(then, 'DD/MM/YYYY HH:mm:ss'), 'd')
        return <div>{duration} {duration > 1 ? 'days ago' : 'day ago'}</div>
      }
    },
    {
      title: 'Sumber',
      dataIndex: 'storeName',
      key: 'storeName',
      render: (text, record) => {
        return (<div>{record.storeName}/{record.employeeName}</div>)
      }
    },
    {
      title: 'Tujuan',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (record) => {
        return <Button onClick={() => tableProps.onRowClick(record)}>Approve</Button>
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered
        pagination={false}
        size="middle"
        columns={columns}
        scroll={{ x: 1000 }}
        rowKey={record => record.id}
      />
    </div>
  )
}

ListTransfer.propTypes = {
  sort: PropTypes.object,
  filter: PropTypes.object,
  updateFilter: PropTypes.func,
  onShowPrint: PropTypes.func,
  showPrintModal: PropTypes.bool,
  storeInfo: PropTypes.object,
  user: PropTypes.func,
  listTransferOut: PropTypes.object,
  getProducts: PropTypes.func,
  getTrans: PropTypes.func,
  listProducts: PropTypes.object,
  listTransOut: PropTypes.object,
  onClosePrint: PropTypes.func
}

export default ListTransfer
