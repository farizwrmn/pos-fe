import React from 'react'
import { Form, Button } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

let currentArray = []

const convertCSVtoArray = (string) => {
  const csvHeader = [
    'approvalCode',
    'cardNumber',
    'cardType',
    'indicator',
    'grossAmount',
    'groupId',
    'MDR',
    'merchantId',
    'EDCBatchNumber',
    'merchantName',
    'nettAmount',
    'originalAmount',
    'transDate',
    'merchantPaymentDate',
    'recordSource',
    'redeemAmount',
    'rewardAmount',
    'MDRAmount',
    'merchantPaymentStatus',
    'reportDate',
    'merchantSettleDate',
    'terminalId',
    'transactionDate',
    'transactionTime',
    'sequenceNumber',
    'traceNumber',
    'transactionCode'
  ]
  const csvRows = String(string).trim().split('\n')

  const array = csvRows.map((record) => {
    const values = record.split(';')
    const obj = csvHeader.reduce((object, header, index) => {
      object[header] = values[index]
      return object
    }, {})
    return obj
  })

  let reformatArray = array.map((record, index) => {
    if (!Number(record.grossAmount)) {
      console.log('record', record)
      console.log('index', index)
    }
    return ({
      EDCBatchNumber: Number(record.EDCBatchNumber),
      MDR: Number(record.MDR),
      MDRAmount: Number(record.MDRAmount),
      approvalCode: record.approvalCode,
      cardNumber: record.cardNumber,
      cardType: record.cardType,
      transDate: record.transDate,
      grossAmount: Number(record.grossAmount),
      groupId: record.groupId,
      indicator: record.indicator,
      merchantId: Number(record.merchantId),
      merchantName: String(record.merchantName).trim(),
      merchantPaymentDate: record.merchantPaymentDate,
      merchantPaymentStatus: record.merchantPaymentStatus,
      merchantSettleDate: record.merchantSettleDate,
      nettAmount: Number(record.nettAmount),
      originalAmount: Number(record.originalAmount),
      recordSource: record.recordSource,
      redeemAmount: Number(record.redeemAmount),
      reportDate: record.reportDate,
      rewardAmount: Number(record.rewardAmount),
      sequenceNumber: Number(record.sequenceNumber),
      terminalId: Number(record.terminalId),
      traceNumber: Number(record.traceNumber),
      transactionCode: record.transactionCode,
      transactionDate: record.transactionDate,
      transactionTime: record.transactionTime
    })
  })

  reformatArray = reformatArray.filter(filtered => !String(filtered.recordSource).includes('RC')
    && !String(filtered.recordSource).includes('UD')
    && !String(filtered.recordSource).includes('UC')
  )
  console.log('reformatArray', reformatArray)
  currentArray = reformatArray.map((record, index) => {
    let type

    if (String(record.recordSource).includes('TD')
      || String(record.recordSource).includes('SD')
      || String(record.recordSource).includes('AD')
      || String(record.recordSource).includes('TF')
      || String(record.recordSource).includes('SF')
      || String(record.recordSource).includes('AF')) {
      type = 'D'
    }

    if (String(record.recordSource).includes('TC')
      || String(record.recordSource).includes('SC')
      || String(record.recordSource).includes('AC')
      || String(record.recordSource).includes('PC')) {
      type = 'K'
    }

    if (String(record.recordSource).includes('TQ')
      || String(record.recordSource).includes('AS')) {
      type = 'QR'
    }

    if (!record.merchantId) {
      console.log('record', record)
      console.log('index', index)
    }

    return ({
      edcBatchNumber: record.EDCBatchNumber,
      merchantId: record.merchantId,
      merchantName: record.merchantName,
      mdrAmount: record.MDRAmount,
      recordSource: record.recordSource,
      grossAmount: record.grossAmount,
      redeemAmount: record.redeemAmount,
      transDate: moment(record.transDate).format('YYYY-MM-DD'),
      type,
      bank: 'BCA'
    })
  })
}

const FormAutoCounter = ({
  loading,
  autoRecon,
  importCSV,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      if (currentArray.length < 1) {
        return 'This feature is not supported to this bank.'
      }
      importCSV(currentArray)
    })
  }

  const fileReader = new FileReader()
  const handleOnChange = (event) => {
    const file = event.target.files[0]
    fileReader.onload = function (event) {
      const text = event.target.result
      convertCSVtoArray(text)
    }

    fileReader.readAsText(file)
  }

  return (
    <div>
      <Form>
        <FormItem label="Csv File" hasFeedback>
          {getFieldDecorator('file', {
            rules: [{
              required: true
            }]
          })(
            <input type="file" accept=".csv" onChange={handleOnChange} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="download" onClick={() => handleSubmit()} loading={loading && loading.effects['bankentry/importCsv']} disabled={!getFieldsValue().file}>Import</Button>
          <Button type="primary" icon="check" onClick={() => autoRecon()} loading={loading && loading.effects['bankentry/importCsv']}>Start Reconciliation</Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default Form.create()(FormAutoCounter)
