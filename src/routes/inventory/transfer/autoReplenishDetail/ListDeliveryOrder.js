import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link, routerRedux } from 'dva/router'
import { Table, Button, Modal, Tag, Icon, message } from 'antd'
import PrintPDF from './PrintPDF'
import PrintPDFv2 from './PrintPDFv2'

const ListDeliveryOrder = ({ dispatch, ...tableProps }) => {
  const { listDeliveryOrder, onClickPrinted, updateFilter, showPrintModal, storeInfo, user, listProducts, onClosePrint } = tableProps
  const toDetail = (record) => {
    if (record.active && !record.status) {
      dispatch(routerRedux.push(`/delivery-order-detail/${record.id}`))
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
  const printProps = {
    listItem: listProducts,
    itemPrint: listDeliveryOrder && listDeliveryOrder.id ? {
      transNo: listDeliveryOrder.transNo,
      employeeName: listDeliveryOrder.employeeName,
      carNumber: listDeliveryOrder.carNumber,
      storeName: listDeliveryOrder.storeName,
      transDate: listDeliveryOrder.transDate,
      totalColly: listDeliveryOrder.totalColly,
      storeNameReceiver: listDeliveryOrder.storeNameReceiver,
      description: listDeliveryOrder.description
    } : {
      transNo: '',
      employeeName: '',
      carNumber: '',
      storeName: '',
      totalColly: '',
      storeNameReceiver: '',
      description: ''
    },
    storeInfo,
    user,
    printNo: 1
  }
  const modalProps = {
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    footer: null,
    width: '300px',
    visible: showPrintModal,
    onCancel () {
      onClosePrint()
    }
  }
  const handleChange = (pagination, filters, sorter) => {
    updateFilter(pagination, filters, sorter)
  }
  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        if (record.active && !record.status) {
          return (<Link to={`/delivery-order-detail/${record.id}`}>{text}</Link>)
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
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      onCellClick: record => toDetail(record),
      render: (text) => {
        return moment(text).format('DD MMM YYYY')
      }
    },
    {
      title: 'Print',
      dataIndex: 'isPrinted',
      key: 'isPrinted',
      onCellClick: record => toDetail(record),
      render: (text) => {
        if (text) {
          return (
            <Tag color="red">
              Printed
            </Tag>
          )
        }
        return (
          <Tag color="green">
            Not Printed
          </Tag>
        )
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
              Completed
            </Tag>
          )
        }
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 130,
      fixed: 'right',
      render: (record) => {
        let disabled = false
        if (record.active && record.status) {
          disabled = true
        }
        return <Button disabled={disabled || tableProps.loading} onClick={() => clickPrint(record)} type="primary" icon="check" loading={tableProps.loading}>Complete</Button>
      }
    }
  ]
  return (
    <div>
      <Modal {...modalProps} title="Print">
        <PrintPDF {...printProps} />
        <PrintPDFv2 {...printProps} />
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-green"
          loading={tableProps['autoReplenishSubmission/edit']}
          style={{ marginLeft: '100px' }}
          onClick={() => {
            if (listDeliveryOrder && listDeliveryOrder.id) {
              onClickPrinted(listDeliveryOrder.id)
            }
          }}
        >
          <Icon type="check" className="icon-large" />
        </Button>
      </Modal>
      <h3>Delivery Order</h3>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1200 }}
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
