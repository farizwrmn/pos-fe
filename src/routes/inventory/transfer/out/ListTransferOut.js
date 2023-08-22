import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import moment from 'moment'
import { Table, Button, Modal, Tag } from 'antd'
import PrintPDF from './PrintPDF'
import PrintPDFv2 from './PrintPDFv2'

const ListTransfer = ({ ...tableProps, deliveryOrderNo, listTransOut, filter, sort, updateFilter, onShowPrint, showPrintModal, storeInfo, user, getProducts, getTrans, listProducts, onClosePrint }) => {
  const clickPrint = (record) => {
    const { transNo, storeIdReceiver } = record
    getProducts(transNo)
    getTrans(transNo, storeIdReceiver)
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

  const { dataSource } = tableProps

  const unique = (group, code) => {
    return group.map((key) => {
      return key[code]
    }).filter((e, index, array) => {
      return index === array.indexOf(e)
    })
  }

  const storeNames = dataSource !== undefined ? (dataSource.length > 0 ? unique(dataSource, 'storeName') : []) : []
  let filterStoreName = []
  for (let i = 0; i < storeNames.length; i += 1) {
    filterStoreName.push({ text: storeNames[i], value: storeNames[i] })
  }

  sort = sort || {}
  filter = filter || {}
  const columns = [
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      sorter: (a, b) => (a.transNo.length + 1) - b.transNo.length,
      sortOrder: sort.columnKey === 'transNo' && sort.order,
      render: text => <Link to={`/inventory/transfer/out/${encodeURIComponent(text)}`}>{text}</Link>
    },
    {
      title: 'Delivery Order',
      dataIndex: 'deliveryOrderNo',
      key: 'deliveryOrderNo',
      sorter: (a, b) => (a.transNo.length + 1) - b.transNo.length,
      sortOrder: sort.columnKey === 'transNo' && sort.order,
      render: (text) => {
        if (deliveryOrderNo === text) {
          return <Link to={`/inventory/transfer/out/${encodeURIComponent(text)}?deliveryOrderNo=${encodeURIComponent(text)}`}>{text}</Link>
        }
        return <Link to={`/inventory/transfer/out?deliveryOrderNo=${encodeURIComponent(text)}`}>{text}</Link>
      }
    },
    {
      title: 'Sender',
      dataIndex: 'storeName',
      key: 'storeName',
      filters: filterStoreName,
      filteredValue: filter.storeName || null,
      onFilter: (value, record) => record.storeName.includes(value),
      sorter: (a, b) => (a.storeName.length + 1) - b.storeName.length,
      sortOrder: sort.columnKey === 'storeName' && sort.order
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
      title: 'Posting',
      dataIndex: 'posting',
      key: 'posting',
      render: (text, record) => {
        if (text || record.invoicing || record.paid) {
          return (
            <Tag color="green">
              Posted
            </Tag>
          )
        }
        return (
          <Tag color="red">
            Not Posted
          </Tag>
        )
      }
    },
    {
      title: 'Invoiced',
      dataIndex: 'invoicing',
      key: 'invoicing',
      render: (text, record) => {
        if (text || record.paid) {
          return (
            <Tag color="green">
              Invoiced
            </Tag>
          )
        }
        return (
          <Tag color="red">
            Not Invoiced
          </Tag>
        )
      }
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      render: (text) => {
        if (text) {
          return (
            <Tag color="green">
              Paid
            </Tag>
          )
        }
        return (
          <Tag color="red">
            Not Paid
          </Tag>
        )
      }
    },
    {
      title: 'Paid Date',
      dataIndex: 'paidDate',
      key: 'paidDate',
      render: (text) => {
        if (text) {
          return moment(text).format('DD MMM YYYY HH:mm:ss')
        }
        return null
      }
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => {
        if (text) {
          return moment(text).format('DD MMM YYYY HH:mm:ss')
        }
        return null
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
      </Modal>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1200 }}
        rowKey={record => record.id}
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
