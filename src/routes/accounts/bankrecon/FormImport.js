import React from 'react'
import { Form, Button, Select } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option

let currentArray = []

const bcaCSVtoArray = (string) => {
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
  const csvRows = String(string).slice(String(string).indexOf('\n') + 1).split('\n')

  const array = csvRows.map((record) => {
    const values = record.split(';')
    const obj = csvHeader.reduce((object, header, index) => {
      object[header] = values[index]
      return object
    }, {})
    return obj
  })

  let reformatArray = array.map((record) => {
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
  reformatArray = reformatArray.filter(filtered => !String(filtered.recordSource).includes('PC')
    && !String(filtered.recordSource).includes('RC')
    && !String(filtered.recordSource).includes('UD')
    && !String(filtered.recordSource).includes('UC')
    && filtered.grossAmount
  )
  currentArray = reformatArray.map((record) => {
    let type

    if (String(record.recordSource).includes('TD')
      || String(record.recordSource).includes('SD')
      || String(record.recordSource).includes('AD')) {
      type = 'D'
    }

    if (String(record.recordSource).includes('TC')
      || String(record.recordSource).includes('SC')
      || String(record.recordSource).includes('AC')) {
      type = 'K'
    }

    if (String(record.recordSource).includes('TQ')
      || String(record.recordSource).includes('AS')) {
      type = 'QR'
    }

    return ({
      edcBatchNumber: record.EDCBatchNumber,
      merchantId: record.merchantId,
      merchantName: record.merchantName,
      mdrAmount: record.MDRAmount,
      recordSource: record.recordSource,
      grossAmount: record.grossAmount,
      transDate: moment(record.transDate).format('YYYY-MM-DD'),
      type,
      bank: 'BCA'
    })
  })
}

const FormAutoCounter = ({
  loading,
  dispatch,
  listBank,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  let bankOption = (listBank || []).map(record => <Option key={record.id} value={record.id}>{record.bankCode} - {record.bankName}</Option>)

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      if (currentArray.length < 1) {
        return 'This feature is not supported to this bank.'
      }
      dispatch({
        type: 'bankentry/importCsv',
        payload: {
          list: currentArray
        }
      })
    })
  }

  const handleSearchBank = (value) => {
    console.log('value', value)
  }

  const fileReader = new FileReader()
  const handleOnChange = (event) => {
    const file = event.target.files[0]

    fileReader.onload = function (event) {
      const text = event.target.result
      if (getFieldsValue().bank === 1) {
        bcaCSVtoArray(text)
      }
    }

    fileReader.readAsText(file)
  }

  return (
    <div>
      <Form>
        <FormItem label="Bank" hasFeedback>
          {getFieldDecorator('bank', {
            rules: [{
              required: true
            }]
          })(
            <Select
              placeholder="Pilih Bank"
              showSearch
              onSearch={handleSearchBank}
              filterOption={false}
            >
              {bankOption}
            </Select>
          )}
        </FormItem>
        <FormItem label="Csv File" hasFeedback>
          {getFieldDecorator('file', {
            rules: [{
              required: true
            }]
          })(
            <input type="file" accept=".csv" onChange={handleOnChange} disabled={!getFieldsValue().bank} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="download" onClick={() => handleSubmit()} loading={loading && loading.effects['bankentry/importCsv']}>Import</Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default Form.create()(FormAutoCounter)
