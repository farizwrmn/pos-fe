import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import moment from 'moment'
import { Table, Button, Modal, Tag } from 'antd'
import PrintPDF from './PrintPDF'

const ListTransfer = ({ ...tableProps, filter, sort, updateFilter, onShowPrint, showPrintModal, storeInfo, user, getProducts, getTrans, listProducts, listTransOut, onClosePrint }) => {
  const transHeader = listTransOut ? {
    employeeId: {
      key: listTransOut.employeeId || '',
      label: listTransOut.employeeName || ''
    },
    storeId: {
      key: listTransOut.storeId || '',
      label: listTransOut.storeName || ''
    },
    storeIdReceiver: {
      key: listTransOut.storeIdReceiver || '',
      label: listTransOut.storeNameReceiver || ''
    },
    totalColly: listTransOut.totalColly || '',
    transNo: listTransOut.transNo || '',
    transType: listTransOut.transType || '',
    carNumber: listTransOut.carNumber || '',
    description: listTransOut.description || '',
    reference: listTransOut.reference || ''
  } : {}

  const clickPrint = (record) => {
    const { transNo, storeIdReceiver } = record
    getProducts(transNo)
    getTrans(transNo, storeIdReceiver)
    onShowPrint()
  }

  const printProps = {
    listItem: listProducts,
    itemPrint: transHeader,
    itemHeader: transHeader,
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
    updateFilter(filters, sorter)
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
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
      filters: filterStoreName,
      filteredValue: filter.storeName || null,
      onFilter: (value, record) => record.storeName.includes(value),
      sorter: (a, b) => (a.storeName.length + 1) - b.storeName.length,
      sortOrder: sort.columnKey === 'storeName' && sort.order
    },
    {
      title: 'Store Name Receiver',
      dataIndex: 'storeNameReceiver',
      key: 'storeNameReceiver'
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: (text) => {
        return moment(text).format('DD MMMM YYYY')
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (<span>
          <Tag color={text && record.active ? 'blue' : !text && !record.active ? 'red' : 'green'}>
            {text && record.active ? 'In progress' : !text && !record.active ? 'Canceled' : 'Accepted'}
          </Tag>
        </span>)
      }
    },
    {
      title: 'Transaction No',
      dataIndex: 'transNo',
      key: 'transNo',
      sorter: (a, b) => (a.transNo.length + 1) - b.transNo.length,
      sortOrder: sort.columnKey === 'transNo' && sort.order,
      render: text => <Link to={`/inventory/transfer/out/${encodeURIComponent(text)}`}>{text}</Link>
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
      </Modal>
      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        scroll={{ x: 1000 }}
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
  listReturnSales: PropTypes.object,
  getProducts: PropTypes.func,
  getTrans: PropTypes.func,
  listProducts: PropTypes.object,
  listTransOut: PropTypes.object,
  onClosePrint: PropTypes.func
}

export default ListTransfer
