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

  const handleChangeFile = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (e) => {
      const content = e.target.result

      // Parse HTML content using DOMParser
      // eslint-disable-next-line no-undef
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')

      console.log('doc', doc)
      // Extract table rows
      const table = doc.querySelector('table')
      const rows = Array.from(table.rows)

      const data = rows.map((row) => {
        return Array.from(row.cells).map(cell => cell.textContent.trim())
      })

      let finalRequest = []

      let csvHeader = [
        'traceNumber', // Transaction Id
        'traceNumber', // Reff No
        'traceNumber', // Acquiring Bank
        'traceNumber', // Issuing Bank
        'cardNumber', // Card No
        'traceNumber', // On Us / Off Us
        'recordSource', // Card Type
        'transactionDate', // Authorization Date
        'transactionTime', // Authorization Time
        'grossAmount', // Authorization Amount
        'status', // Transaction Status
        'traceNumber', // Sales Type
        'traceNumber', // Response Code
        'traceNumber', // Response Desc
        'approvalCode', // Approval Code
        'merchantId', // MID
        'traceNumber', // TID
        'traceNumber', // MID Bank
        'traceNumber', // TID Bank
        'traceNumber', // Store Code
        'traceNumber', // Branch Code
        'merchantName' // Merchant Name
      ]
      if (file && file.name && file.name.includes('Qris')) {
        csvHeader = [
          'traceNumber', // Transaction Id
          'approvalCode', // Reff Id
          'traceNumber', // Acquiring Bank
          'traceNumber', // Issuing Bank
          'traceNumber', // CPAN
          'traceNumber', // MPAN
          'traceNumber', // On Us / Off Us
          'transactionDate', // Authorization Date
          'transactionTime', // Authorization Time
          'grossAmount', // Authorization Amount
          'status', // Transaction Status
          'recordSource', // Sales Type
          'traceNumber', // Response Code
          'traceNumber', // Response Desc
          'merchantId', // MID
          'traceNumber', // TID
          'merchantName' // Merchant Name
        ]
      }

      for (let rowIndex in data) {
        const request = {}
        for (let key in csvHeader) {
          if (data && data[rowIndex] && data[rowIndex][key]) {
            request[csvHeader[key]] = data[rowIndex][key].replace("'", '')
          } else {
            request[csvHeader[key]] = ''
          }
        }
        finalRequest.push(request)
      }

      // console.log('request', finalRequest)

      finalRequest = finalRequest.map((item) => {
        let recordSource = item.recordSource
        let dateFormat = 'DD-MM-YYYY'
        if (item.recordSource === 'DEBIT') {
          recordSource = 'DEBIT-MANDIRI'
        }
        if (item.status !== 'Approve') return null
        if (item.approvalCode === '' && item.transactionDate === '') return null
        if (item.transactionDate === 'Approval Code') return null
        if (item.recordSource === 'CREDIT') {
          recordSource = 'KREDIT-MANDIRI'
        }
        if (item.recordSource.includes('QRIS')) {
          recordSource = 'QRIS-MANDIRI'
          dateFormat = 'DD-MM-YYYY'
          item.approvalCode = item.approvalCode.slice(-6)
        }
        if (item.recordSource === 'MPM') {
          recordSource = 'QRIS-MANDIRI'
          dateFormat = 'YYYY-MM-DD HH:mm:ss'
          item.approvalCode = item.approvalCode.slice(-6)
        }
        if (item.recordSource === 'CPM') {
          recordSource = 'QRIS-MANDIRI'
          dateFormat = 'YYYY-MM-DD HH:mm:ss'
          item.approvalCode = item.approvalCode.slice(-6)
        }

        return ({
          approvalCode: item.approvalCode,
          cardNumber: item.cardNumber,
          grossAmount: parseInt(item.grossAmount.replace(/,/g, '').split('.')[0], 10),
          mdr: item.mdr || 0,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          nettAmount: parseInt(item.grossAmount.replace(/,/g, '').split('.')[0], 10),
          redeemAmount: 0,
          rewardAmount: 0,
          originalAmount: 0,
          mdrAmount: item.mdrAmount || 0,
          reportDate: moment(item.processEffectiveDate || item.transactionDate, dateFormat).format('YYYY-MM-DD'),
          processEffectiveDate: moment(item.processEffectiveDate || item.transactionDate, dateFormat).format('YYYY-MM-DD'),
          recordSource,
          traceNumber: item.traceNumber,
          transactionCode: item.transactionCode,
          transactionDate: moment(item.transactionDate, dateFormat).format('YYYY-MM-DD'),
          transactionTime: item.transactionTime
        })
      }).filter(filtered => filtered)
      console.log('finalRequest', finalRequest)
      if (finalRequest && finalRequest.length > 0) {
        dispatch({
          type: 'importBcaRecon/bulkInsert',
          payload: {
            bankName: 'MANDIRI',
            filename: file.name,
            data: finalRequest
          }
        })
      } else {
        message.error('No Data to Upload')
      }
    }
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
            accept=".xls"
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
