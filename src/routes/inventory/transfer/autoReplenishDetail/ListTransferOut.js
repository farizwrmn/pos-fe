import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, Button, Modal, Tag, Icon } from 'antd'
import PrintPDF from './PrintPDF'
import PrintPDFv2 from './PrintPDFv2'

const ListTransfer = (tableProps) => {
  const { listTransOut, onClickPrinted, updateFilter, onShowPrint, showPrintModal, storeInfo, user, getProducts, getTrans, listProducts, onClosePrint } = tableProps
  const clickPrint = (record) => {
    const { transNo, storeId } = record
    getProducts(transNo, storeId)
    getTrans(transNo, storeId)
    onShowPrint()
  }

  const printProps = {
    listItem: listProducts,
    itemPrint: listTransOut && listTransOut.id ? {
      transNo: listTransOut.transNo,
      employeeName: listTransOut.employeeName,
      carNumber: listTransOut.carNumber,
      storeName: listTransOut.storeName,
      transDate: listTransOut.transDate,
      totalColly: listTransOut.totalColly,
      storeNameReceiver: listTransOut.storeNameReceiver,
      description: listTransOut.description
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
    width: 200,
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
      key: 'transNo'
    },
    {
      title: 'Delivery Order',
      dataIndex: 'deliveryOrderNo',
      key: 'deliveryOrderNo'
    },
    {
      title: 'Sender',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: 'Receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('DD MMM YYYY')
      }
    },
    {
      title: 'Print',
      dataIndex: 'isPrinted',
      key: 'isPrinted',
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
              In Progress
            </Tag>
          )
        }
        if (received) {
          return (
            <Tag color="green">
              Accepted
            </Tag>
          )
        }
      }
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (record) => {
        return <Button onClick={() => clickPrint(record)}>Print</Button>
        // return <div onClick={() => clickPrint(record.transNo)}><PrintPDF listItem={listProducts} itemPrint={record} itemHeader={transHeader} storeInfo={storeInfo} user={user} printNo={1} /></div>
      }
    }
  ]

  return (
    <div>
      <Modal {...modalProps} >
        <PrintPDF {...printProps} />
        <PrintPDFv2 {...printProps} />
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-green"
          onClick={() => {
            if (listTransOut && listTransOut.id) {
              onClickPrinted(listTransOut.id)
            }
          }}
        >
          <Icon type="check" className="icon-large" />
        </Button>
      </Modal>
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
