/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import moment from 'moment'
import ListFilenameImportCSV from './ListFilenameImportCSV'

const ImportBcaRecon = ({
  loading,
  dispatch,
  importBcaRecon
}) => {
  const { listFilename, pagination } = importBcaRecon
  const listFilenameImportCSV = {
    dataSource: listFilename,
    pagination,
    loading: loading.effects['importBcaRecon/query'] || loading.effects['importBcaRecon/queryImportLog'] || loading.effects['importBcaRecon/bulkInsert'],
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
          mdrAmount: Number((item.mdrAmount || '').replace(',', '')) || 0,
          approvalCode: item.approvalCode,
          cardNumber: item.cardNumber,
          cardType: item.cardType,
          grossAmount: Number((item.grossAmount || '').replace(',', '')) || 0,
          groupId: item.groupId,
          dbCrIndicator: item.dbCrIndicator,
          merchantId: Number(item.merchantId) || 0,
          merchantName: String(item.merchantName).trim(),
          merchantPaymentDate: String(item.merchantPaymentDate).trim() && moment(item.merchantPaymentDate, 'YYYYMMDD').isValid() ? moment(item.merchantPaymentDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
          merchantPaymentStatus: item.merchantPaymentStatus,
          merchantSettleDate: String(item.merchantSettleDate).trim() && moment(item.merchantSettleDate, 'YYYYMMDD').isValid() ? moment(item.merchantSettleDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
          merchantSettleTime: item.merchantSettleTime,
          nettAmount: Number((item.nettAmount || '').replace(',', '')) || 0,
          originalAmount: Number(item.originalAmount) || 0,
          processEffectiveDate: String(item.processEffectiveDate).trim() && moment(item.processEffectiveDate, 'YYYYMMDD').isValid() ? moment(item.processEffectiveDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
          recordSource: item.recordSource,
          redeemAmount: Number((item.redeemAmount || '').replace(',', '')) || 0,
          rewardAmount: Number((item.rewardAmount || '').replace(',', '')) || 0,
          reportDate: String(item.reportDate).trim() && moment(item.reportDate, 'YYYYMMDD').isValid() ? moment(item.reportDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
          terminalId: Number(item.terminalId) || 0,
          sequenceNumber: Number(item.sequenceNumber) || 0,
          traceNumber: Number(item.traceNumber),
          transactionDate: String(item.transactionDate).trim() && moment(item.transactionDate, 'YYYYMMDD').isValid() ? moment(item.transactionDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
          transactionTime: String(item.transactionTime),
          transactionCode: item.transactionCode
        })
      })
      if (reformatArray && reformatArray.length > 0) {
        dispatch({
          type: 'importBcaRecon/bulkInsert',
          payload: {
            filename: file.name,
            data: reformatArray
          }
        })
      } else {
        message.error('No Data to Upload')
      }
    }
    reader.readAsText(file, { header: false })
  }

  return (
    <div className="content-inner">
      <h1>Bank Recon Import</h1>
      <div>
        <span>
          <label htmlFor="importCsv" className="ant-btn ant-btn-primary ant-btn-lg" style={{ marginLeft: '15px', padding: '0.5em' }}>Import</label>
          <input
            id="importCsv"
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
      <ListFilenameImportCSV {...listFilenameImportCSV} />
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
