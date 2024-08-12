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

  const csvHeader = [
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
          console.log('workbook', workbook)
          const sheet = workbook.getWorksheet('Report')
          let finalRequest = []
          await sheet
            .eachRow({ includeEmpty: false }, (obj, rowIndex) => {
              if (rowIndex > 1) {
                let startPoint = 0

                const request = {}
                for (let key in csvHeader) {
                  request[csvHeader[key]] = obj.values[++startPoint]
                }
                console.log('request', request)
                finalRequest.push(request)
              }
            })

          console.log('finalRequest', finalRequest)

          finalRequest = finalRequest.map((item) => {
            let recordSource = item.recordSource
            if (item.recordSource === 'DEBIT') {
              recordSource = 'DEBIT-BNI'
            }
            if (item.recordSource === 'KREDIT') {
              recordSource = 'KREDIT-BNI'
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
              reportDate: moment(item.processEffectiveDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
              processEffectiveDate: moment(item.processEffectiveDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
              recordSource,
              traceNumber: item.traceNumber,
              transactionCode: item.transactionCode,
              transactionDate: moment(item.transactionDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
            })
          })
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

    // reader.onload = (event) => {
    //   const data = event.target.result
    //   const csvRows = String(data).trim().split('\n')
    //   const excelConvertedData = csvRows.map((record) => {
    //     const values = record.split(';')
    //     const obj = csvHeader.reduce((object, header, index) => {
    //       if (values[index]) {
    //         object[header] = values[index].trim()
    //       } else {
    //         object[header] = null
    //       }
    //       return object
    //     }, {})
    //     return obj
    //   })
    //   console.log('excelConvertedData', excelConvertedData)
    //   const reformatArray = excelConvertedData.map((item) => {
    //     return ({
    //       edcBatchNumber: Number(item.edcBatchNumber) || 0,
    //       mdr: Number(item.mdr) || 0,
    //       mdrAmount: Number((item.mdrAmount || '').replace(',', '')) || 0,
    //       approvalCode: item.approvalCode,
    //       cardNumber: item.cardNumber,
    //       cardType: item.cardType,
    //       grossAmount: Number((item.grossAmount || '').replace(',', '')) || 0,
    //       groupId: item.groupId,
    //       dbCrIndicator: item.dbCrIndicator,
    //       merchantId: Number(item.merchantId) || 0,
    //       merchantName: String(item.merchantName).trim(),
    //       merchantPaymentDate: String(item.merchantPaymentDate).trim() && moment(item.merchantPaymentDate, 'YYYYMMDD').isValid() ? moment(item.merchantPaymentDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
    //       merchantPaymentStatus: item.merchantPaymentStatus,
    //       merchantSettleDate: String(item.merchantSettleDate).trim() && moment(item.merchantSettleDate, 'YYYYMMDD').isValid() ? moment(item.merchantSettleDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
    //       merchantSettleTime: item.merchantSettleTime,
    //       nettAmount: Number((item.nettAmount || '').replace(',', '')) || 0,
    //       originalAmount: Number(item.originalAmount) || 0,
    //       processEffectiveDate: String(item.processEffectiveDate).trim() && moment(item.processEffectiveDate, 'YYYYMMDD').isValid() ? moment(item.processEffectiveDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
    //       recordSource: item.recordSource,
    //       redeemAmount: Number((item.redeemAmount || '').replace(',', '')) || 0,
    //       rewardAmount: Number((item.rewardAmount || '').replace(',', '')) || 0,
    //       reportDate: String(item.reportDate).trim() && moment(item.reportDate, 'YYYYMMDD').isValid() ? moment(item.reportDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
    //       terminalId: Number(item.terminalId) || 0,
    //       sequenceNumber: Number(item.sequenceNumber) || 0,
    //       traceNumber: Number(item.traceNumber),
    //       transactionDate: String(item.transactionDate).trim() && moment(item.transactionDate, 'YYYYMMDD').isValid() ? moment(item.transactionDate, 'YYYYMMDD').format('YYYY-MM-DD') : null,
    //       transactionTime: String(item.transactionTime),
    //       transactionCode: item.transactionCode
    //     })
    //   })
    //   if (reformatArray && reformatArray.length > 0) {
    //     // dispatch({
    //     //   type: 'importBcaRecon/bulkInsert',
    //     //   payload: {
    //     //     filename: file.name,
    //     //     data: reformatArray
    //     //   }
    //     // })
    //   } else {
    //     message.error('No Data to Upload')
    //   }
    // }
    // reader.readAsText(file, { header: false })
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
