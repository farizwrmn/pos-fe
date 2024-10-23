/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Excel from 'exceljs/dist/exceljs.min.js'
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
    const workbook = new Excel.Workbook()
    const reader = new FileReader()
    console.log('file', file)
    reader.readAsArrayBuffer(file)

    reader.onload = () => {
      const buffer = reader.result
      workbook.xlsx.load(buffer)
        .then(async (workbook) => {
          let sheet = workbook.getWorksheet('Report')
          let finalRequest = []
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
            'mdr', // RATE
            'mdrAmount', // DISC AMOUNT
            'traceNumber', // AIR FARE
            'traceNumber', // PLAN
            'traceNumber', // SS AMOUNT
            'traceNumber', // SS FEE TYPE
            'traceNumber', // FLAG
            'nettAmount', // NETT AMOUNT
            'merchantName', // MERCHANT ACCOUNT
            'merchantName' // MERCHANT NAME
          ]

          console.log('sheet', sheet)
          if (!sheet) {
            sheet = workbook.getWorksheet('Sheet1')
            console.log('sheet workbook', sheet)
            csvHeader = [
              'traceNumber', // NO
              'merchantName', // Nama Merchant
              'merchantId', // MID
              'transactionCode', // TID
              'traceNumber', // Merchant PAN

              'billNumber', // Bill Number
              'approvalCode', // Reff ID
              'recordSource', // QR Method
              'traceNumber', // Tipe QR
              'traceNumber', // Tipe Transaksi

              'traceNumber', // Nama Issuer
              'traceNumber', // Customer PAN
              'traceNumber', // Source Of Fund
              'traceNumber', // Name Customer
              'traceNumber', // Jenis Pembayaran

              'traceNumber', // Nama Acquirer
              'grossAmount', // Nominal
              'mdrAmount', // MDR
              'nettAmount', // Net Amount
              'transactionDate', // TRX Datetime

              'traceNumber', // Settlement Status
              'traceNumber' // Status
            ]
          }
          await sheet
            .eachRow({ includeEmpty: false }, (obj, rowIndex) => {
              if (rowIndex > 1) {
                let startPoint = 0

                const request = {}
                for (let key in csvHeader) {
                  request[csvHeader[key]] = obj.values[++startPoint]
                }
                finalRequest.push(request)
              }
            })

          console.log('finalRequest', finalRequest)

          finalRequest = finalRequest.map((item) => {
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
              mdr: item.mdr,
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

          if (finalRequest && finalRequest.length > 0) {
            dispatch({
              type: 'importBcaRecon/bulkInsert',
              payload: {
                bankName: 'BNI',
                filename: file.name,
                data: finalRequest
              }
            })
          } else {
            message.error('No Data to Upload')
          }
        })
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
            accept=".xlsx"
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
