import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'dva/router'
import { Table, Button, Modal, Tag, Icon } from 'antd'
import PrintPDF from './PrintPDF'
import PrintPDFAll from './PrintPDFAll'
import PrintPDFv2 from './PrintPDFv2'

const ListDeliveryOrder = ({ loading, ...tableProps }) => {
  const { listDeliveryOrder, onClickPrinted, updateFilter, showPrintModal, storeInfo, user, getTrans, listProducts, listAllProduct, onClosePrint } = tableProps
  const clickPrint = (record) => {
    const { transNo, storeId } = record
    getTrans(transNo, storeId)
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
  const printPDFAllProps = {
    loading,
    // listItem: listProducts,
    listItem: listAllProduct,
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
  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      render: (text, record) => {
        return (<Link to={`/delivery-order-detail/${record.id}`}>{text}</Link>)
      }
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
        return <Button onClick={() => clickPrint(record)} loading={tableProps.loading}>Print</Button>
        // return <div onClick={() => clickPrint(record.transNo)}><PrintPDF listItem={listProducts} itemPrint={record} itemHeader={transHeader} storeInfo={storeInfo} user={user} printNo={1} /></div>
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

      <div style={{ margin: '0.5em' }}>
        {/* <Button type="primary" {...printListProps}>Print List</Button> */}
        <PrintPDFAll {...printPDFAllProps} />
      </div>

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
