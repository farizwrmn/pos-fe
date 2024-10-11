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

  const csvQrisHeader = [
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

  const csvDebitHeader = [
    'merchantId', // MID
    'merchantName', // Merchant Official
    'notdefine', // Trading Name
    'notdefine', // Bank Account
    'notdefine', // Bank Account Name
    'transactionDate', // TRXDATE
    'merchantSettleDate', // SETTLEDATE
    'processEffectiveDate', // PAYMENT DATE
    'notdefine', // TRXCODE
    'notdefine', // DESCRIPTION
    'notdefine', // TENOR
    'cardNumber', // CARD
    'bank', // Issuer Name
    'notdefine', // Country Name
    'notdefine', // Principat
    'notdefine', // On Off Type
    'cardType', // Card Type
    'transactionCode', // TID
    'approvalCode', // AUTHCODE
    'edcBatchNumber', // PAYMENTBATCH
    'notdefine', // TIDBATCH
    'notdefine', // BATCHSEQ
    'grossAmount', // AMOUNT
    'notdefine', // NonMdrAMOUNT
    'mdrAmount', // MDR Amount
    'nettAmount', // NET AMOUNT
    'notdefine' // Bill Reff Num
  ]

  function processValue (value) {
    // Trim spaces around the value
    value = value.trim()

    // Remove single quote if it starts with one
    if (value.startsWith("'")) {
      value = value.slice(1).trim()
    }

    // Convert numeric strings to numbers, ignoring commas
    const numericValue = value.replace(/,/g, '')
    if (!isNaN(numericValue) && numericValue !== '') {
      return Number(numericValue)
    }

    // Return the value or an empty string if it's empty
    return value || ''
  }

  function splitCSV (csvString) {
    let result = []
    let currentValue = ''
    let insideQuotes = false

    for (let i = 0; i < csvString.length; i++) {
      let char = csvString[i]

      // Handle quotes
      if (char === '"') {
        insideQuotes = !insideQuotes
        // eslint-disable-next-line no-continue
        continue
      }

      // If not inside quotes and a comma is encountered, push the value
      if (char === ',' && !insideQuotes) {
        result.push(processValue(currentValue))
        currentValue = '' // Reset for the next value
      } else {
        currentValue += char
      }
    }

    // Push the last value (since there may not be a comma at the end)
    result.push(processValue(currentValue))

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
      let fileType = null // DEBIT OR QRIS
      if (csvRows && csvRows[5]) {
        if (csvRows[5].substring(0, 4) === 'NMID') {
          fileType = 'QRIS'
        } else if (csvRows[5].substring(0, 3) === 'MID') {
          fileType = 'DEBIT'
        }
        console.log('csvRows', csvRows[5].substring(0, 4))
      }
      if (!fileType) {
        message.error('File format is unknown')
        return
      }
      const array = csvRows.map((record) => {
        const values = splitCSV(record)
        let obj
        if (fileType === 'DEBIT') {
          obj = csvDebitHeader.reduce((object, header, index) => {
            object[header] = values[index] ? `${values[index]}`.trim() : values[index]
            return object
          }, {})
        } else if (fileType === 'QRIS') {
          obj = csvQrisHeader.reduce((object, header, index) => {
            object[header] = values[index] ? `${values[index]}`.trim() : values[index]
            return object
          }, {})
        }
        return obj
      })
      let processEffectiveDate = ''
      const reformatArray = array.map((item) => {
        if (item.merchantId === 'Report Date') {
          processEffectiveDate = item.merchantName
        }
        let recordSource = 'QRIS-MANDIRI'
        if (fileType === 'DEBIT') {
          if (item.cardType === 'Debit') {
            recordSource = 'DEBIT-MANDIRI'
          } else if (item.cardType === 'Credit') {
            recordSource = 'KREDIT-MANDIRI'
          }
          if (item.merchantName === 'Merchant Official') {
            return null
          }
        } else if (fileType === 'QRIS') {
          recordSource = 'QRIS-MANDIRI'
          if (item.bank === 'TOTAL AMOUNT') {
            return null
          }
          if (item.bank === 'TRXTIME') {
            return null
          }
        }
        if (!item.bank) {
          item.bank = 'N/A'
        }

        if (item.grossAmount == null) {
          return null
        }
        if (!item.approvalCode) {
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
