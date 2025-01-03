/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import moment from 'moment'
import ListFilenameImportCSV from './ListFilenameImportCSV'

let csvHeader = [
  'processEffectiveDate', // PROC DATE
  'merchantId', // MID
  'traceNumber', // OB
  'traceNumber', // GB
  'traceNumber', // SEQ
  'traceNumber', // TYPE
  'transactionDate', // TRX DATE
  'approvalCode', // AUTH
  'cardNumber', // CARD NO
  'grossAmount', // AMOUNT
  'transactionCode', // TID
  'recordSource', // JENIS TRX
  'traceNumber', // PTR
  'mdr' // RATE
]

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

  const handleChangeFile = (event) => {
    const file = event.target.files[0]
    console.log('handleChangeFile', file)
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
        if (item.processEffectiveDate === 'PROC DATE') return null
        let recordSource = item.recordSource
        let dateFormat = 'DD/MM/YYYY'
        if (item.recordSource === 'DEBIT') {
          recordSource = 'DEBIT-BNI'
        }
        if (item.recordSource === 'KREDIT') {
          recordSource = 'KREDIT-BNI'
        }
        if (item.recordSource === 'QRIS') {
          recordSource = 'QRIS-BNI'
          dateFormat = 'DD/MM/YYYY'
          item.approvalCode = item.approvalCode.slice(-6)
        }
        if (item.recordSource === 'MPM') {
          recordSource = 'QRIS-BNI'
          dateFormat = 'YYYY-MM-DD HH:mm:ss'
          item.approvalCode = item.approvalCode.slice(-6)
        }
        if (item.recordSource === 'CPM') {
          recordSource = 'QRIS-BNI'
          dateFormat = 'YYYY-MM-DD HH:mm:ss'
          item.approvalCode = item.approvalCode.slice(-6)
        }
        return ({
          approvalCode: item.approvalCode,
          cardNumber: item.cardNumber,
          grossAmount: item.grossAmount,
          mdr: item.mdr.replace(',', '.'),
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          nettAmount: item.nettAmount,
          redeemAmount: 0,
          rewardAmount: 0,
          originalAmount: 0,
          mdrAmount: item.mdrAmount,
          reportDate: moment(item.processEffectiveDate || item.transactionDate, dateFormat).format('YYYY-MM-DD'),
          processEffectiveDate: moment(item.processEffectiveDate || item.transactionDate, dateFormat).format('YYYY-MM-DD'),
          recordSource,
          traceNumber: item.traceNumber,
          transactionCode: item.transactionCode,
          transactionDate: moment(item.transactionDate, dateFormat).format('YYYY-MM-DD')
        })
      }).filter(filtered => filtered)

      console.log('reformatArray', reformatArray)
      if (reformatArray && reformatArray.length > 0) {
        dispatch({
          type: 'importBcaRecon/bulkInsert',
          payload: {
            bankName: 'BNI',
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
