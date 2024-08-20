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
    'merchantId', // MID
    'merchantName', // Merchant Official
    'notdefine', // Trading Name
    'notdefine', // Bank Account
    'notdefine', // Bank Account Name
    'transactionDate', // TRXDATE
    'transactionTime', // TRXTIME
    'bank', // Issuer Name
    'transactionCode', // TID
    'edcBatchNumber', // Reference Number
    'approvalCode', // Reff ID/Invoice No
    'grossAmount', // AMOUNT
    'mdrAmount', // MDR Amount
    'nettAmount' // NET AMOUNT
  ]

  function splitCSV (csvString) {
    // Regular expression to match CSV values
    const pattern = /(".*?"|[^",]+)(?=\s*,|\s*$)/g

    // Array to hold the results
    let result = []
    let match

    // Find all matches using the pattern
    while (match = pattern.exec(csvString)) {
      // Get the matched value
      let value = match[1].trim()

      // Remove enclosing double quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }

      // Remove single quote if it starts with one
      if (value.startsWith("'")) {
        value = value.slice(1).trim()
      }

      // Convert numeric strings to numbers, ignoring commas
      const numericValue = value.replace(/,/g, '')
      if (!isNaN(numericValue)) {
        value = Number(numericValue)
      }

      result.push(value)
    }

    return result
  }


  const handleChangeFile = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      const csvReplaced = String(data)
        .replace(/(?:\\[r]|[\r]+)+/g, '')
      const csvRows = csvReplaced
        .trim()
        .split('\n')
      if (csvRows && csvRows[0] && csvRows[0].trim() !== 'MERCHANT STATEMENT') {
        message.error(`File format error "${csvRows[0]}"`)
        return
      }
      const array = csvRows.map((record) => {
        const values = splitCSV(record)
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index] ? `${values[index]}`.trim() : values[index]
          return object
        }, {})
        return obj
      })
      let processEffectiveDate = ''
      const reformatArray = array.map((item) => {
        if (item.merchantId === 'Report Date') {
          processEffectiveDate = item.merchantName
        }
        let recordSource = 'DEBIT-MANDIRI'
        if (!item.bank) {
          return null
        }
        if (item.bank === 'TOTAL AMOUNT') {
          return null
        }
        if (item.bank === 'TRXTIME') {
          return null
        }
        if (item.grossAmount == null) {
          return null
        }
        return ({
          bank: item.bank,
          approvalCode: item.approvalCode.slice(-6),
          edcBatchNumber: item.edcBatchNumber.slice(-6),
          cardNumber: item.cardNumber,
          grossAmount: item.grossAmount,
          mdr: item.mdr,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          nettAmount: item.nettAmount,
          redeemAmount: 0,
          rewardAmount: 0,
          originalAmount: 0,
          mdrAmount: item.mdrAmount,
          reportDate: moment(processEffectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          processEffectiveDate: moment(processEffectiveDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          recordSource,
          traceNumber: item.traceNumber,
          transactionCode: item.transactionCode,
          transactionDate: moment(item.transactionDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
        })
      }).filter(filtered => filtered)

      console.log('reformatArray', reformatArray)
      if (reformatArray && reformatArray.length > 0) {
        dispatch({
          type: 'importBcaRecon/bulkInsert',
          payload: {
            bankName: 'MANDIRI',
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
