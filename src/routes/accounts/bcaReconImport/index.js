/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import List from './List'

let currentData = []
const setData = (data) => {
  currentData = data
}

const ImportBcaRecon = ({
  loading,
  dispatch,
  importBcaRecon
}) => {
  const { list, pagination } = importBcaRecon
  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/bulkInsert'],
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    }
  }

  const uploadProps = {
    name: 'file',
    processData: false
  }

  const csvHeader = [
    'approvalCode',
    'cardNumber',
    'cardType',
    'dbCrIndicator',
    'grossAmount',
    'groupId',
    'mdr',
    'merchantId',
    'edcBatchNumber',
    'merchantName',
    'nettAmount',
    'originalAmount',
    'processEffectiveDate',
    'merchantPaymentDate',
    'recordSource',
    'redeemAmount',
    'rewardAmount',
    'mdrAmount',
    'merchantPaymentStatus',
    'reportDate',
    'merchantSettleDate',
    'merchantSettleTime',
    'terminalId',
    'transactionDate',
    'transactionTime',
    'sequenceNumber',
    'traceNumber',
    'transactionCode'
  ]

  const handleChangeFile = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      console.log('data', data)
      const csvRows = String(data).trim().split('\n')
      const array = csvRows.map((record) => {
        const values = record.split(';')
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index].trim()
          return object
        }, {})
        return obj
      })
      const reformatArray = array.map((item) => {
        return ({
          edcBatchNumber: Number(item.edcBatchNumber) || 0,
          mdr: Number(item.mdr) || 0,
          mdrAmount: Number(item.mdrAmount) || 0,
          approvalCode: item.approvalCode,
          cardNumber: item.cardNumber,
          cardType: item.cardType,
          grossAmount: Number(item.grossAmount) || 0,
          groupId: item.groupId,
          dbCrIndicator: item.dbCrIndicator,
          merchantId: Number(item.merchantId) || 0,
          merchantName: String(item.merchantName).trim(),
          merchantPaymentDate: item.merchantPaymentDate,
          merchantPaymentStatus: item.merchantPaymentStatus,
          merchantSettleDate: item.merchantSettleDate,
          merchantSettleTime: item.merchantSettleTime,
          nettAmount: Number(item.nettAmount) || 0,
          originalAmount: Number(item.originalAmount) || 0,
          processEffectiveDate: item.processEffectiveDate,
          recordSource: item.recordSource,
          redeemAmount: Number(item.redeemAmount) || 0,
          rewardAmount: Number(item.rewardAmount) || 0,
          reportDate: item.reportDate,
          terminalId: Number(item.terminalId) || 0,
          sequenceNumber: Number(item.sequenceNumber) || 0,
          traceNumber: Number(item.traceNumber),
          transactionDate: String(item.transactionDate).trim() ? moment(item.transactionDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
          transactionTime: item.transactionTime,
          transactionCode: item.transactionCode
        })
      })
      console.log('newDataObjects', reformatArray)
      setData(reformatArray)
    }
    reader.readAsText(file, { header: false })
  }


  return (
    <div className="content-inner">
      <div>
        <span>
          <label htmlFor="opname" className="ant-btn ant-btn-primary ant-btn-lg" style={{ marginLeft: '15px', padding: '0.5em' }}>Select File</label>
          <input
            id="opname"
            type="file"
            accept=".csv"
            className="ant-btn ant-btn-default ant-btn-lg"
            style={{ visibility: 'hidden' }}
            {...uploadProps}
            onClick={(event) => {
              event.target.value = null
            }}
            onInput={(event) => {
              handleChangeFile(event)
            }}
          />
        </span>
      </div>
      {currentData}
      <List {...listProps} />
    </div>
  )
}

export default connect(
  ({
    loading,
    importBcaRecon
  }) => ({
    loading,
    importBcaRecon
  })
)(ImportBcaRecon)
