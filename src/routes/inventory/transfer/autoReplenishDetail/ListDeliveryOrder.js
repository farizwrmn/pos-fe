import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'dva/router'
import { Table, Button, Modal, Tag, message } from 'antd'
import PrintPDFAll from './PrintPDFAll'
import PrintPDFTrucking from './PrintPDFTrucking'

const ListDeliveryOrder = ({ dispatch, loading, ...tableProps }) => {
  const { listTransferOut, onClickPrinted, updateFilter, user, listAllProduct, itemPrint } = tableProps
  const toDetail = (record) => {
    if (record.active && !record.status) {
      window.open(`/delivery-order-detail/${record.id}`, '_blank')
    } else {
      message.error('Already complete')
    }
  }
  const clickPrint = (record) => {
    Modal.confirm({
      title: 'Mark as Complete ?',
      content: 'Are you sure ?',
      onOk () {
        onClickPrinted(record.id)
      }
    })
  }
  // const printProps = {
  //   listItem: listProducts,
  //   itemPrint: listDeliveryOrder && listDeliveryOrder.id ? {
  //     transNo: listDeliveryOrder.transNo,
  //     employeeName: listDeliveryOrder.employeeName,
  //     carNumber: listDeliveryOrder.carNumber,
  //     storeName: listDeliveryOrder.storeName,
  //     transDate: listDeliveryOrder.transDate,
  //     totalColly: listDeliveryOrder.totalColly,
  //     storeNameReceiver: listDeliveryOrder.storeNameReceiver,
  //     description: listDeliveryOrder.description
  //   } : {
  //     transNo: '',
  //     employeeName: '',
  //     carNumber: '',
  //     storeName: '',
  //     totalColly: '',
  //     storeNameReceiver: '',
  //     description: ''
  //   },
  //   storeInfo,
  //   user,
  //   printNo: 1
  // }
  // const modalProps = {
  //   maskClosable: false,
  //   wrapClassName: 'vertical-center-modal',
  //   footer: null,
  //   width: '300px',
  //   visible: showPrintModal,
  //   onCancel () {
  //     onClosePrint()
  //   }
  // }
  const handleChange = (pagination, filters, sorter) => {
    updateFilter(pagination, filters, sorter)
  }

  const printPDFAllProps = {
    listTrans: listAllProduct,
    itemPrint,
    user
  }

  const printPDFTruckingProps = {
    listTrans: listTransferOut,
    itemPrint,
    user
  }

  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        if (record.active && !record.status) {
          return (<Link target="_blank" to={`/delivery-order-detail/${record.id}`}>{text}</Link>)
        }
        return text
      }
    },
    {
      title: 'Sender',
      dataIndex: 'storeName',
      key: 'storeName',
      onCellClick: record => toDetail(record)
    },
    {
      title: 'Receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver',
      onCellClick: record => toDetail(record)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      onCellClick: record => toDetail(record),
      render: (text) => {
        return moment(text).format('DD MMM YYYY, HH:mm:ss')
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      onCellClick: record => toDetail(record),
      render: (text, record) => {
        const nonActive = !record.active
        const received = record.status
        const inProgress = record.active && !record.status
        if (nonActive) {
          return (
            <Tag color="red">
              Canceled
            </Tag>
          )
        }
        if (inProgress) {
          return (
            <Tag color="blue">
              Picking
            </Tag>
          )
        }
        if (received) {
          return (
            <Tag color="green">
              Packed
            </Tag>
          )
        }
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 130,
      render: (record) => {
        let disabled = false
        if (record.active && record.status) {
          disabled = true
        }
        return <Button disabled={disabled || loading} onClick={() => clickPrint(record)} type="primary" icon="check" loading={loading}>Complete</Button>
      }
    }
  ]
  return (
    <div>
      <h3>Delivery Order</h3>

      <div style={{ margin: '0.5em' }}>
        <PrintPDFAll {...printPDFAllProps} />
        <PrintPDFTrucking {...printPDFTruckingProps} />
      </div>

      <Table {...tableProps}
        bordered
        columns={columns}
        scroll={{ x: 1000 }}
        simple
        pagination={false}
        onChange={handleChange}
      />
    </div>
  )
}
ListDeliveryOrder.propTypes = {
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
  listDeliveryOrder: PropTypes.object,
  onClosePrint: PropTypes.func
}
export default ListDeliveryOrder
