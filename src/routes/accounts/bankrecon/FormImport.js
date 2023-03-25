import React from 'react'
import { Form, Button, Select, DatePicker, LocaleProvider, message } from 'antd'
import moment from 'moment'
import enUS from 'antd/lib/locale-provider/en_US'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option

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
    'effectiveDate',
    'merchantPaymentDate',
    'recordSource',
    'redeemAmount',
    'rewardAmount',
    'MDRAmount',
    'merchantPaymentStatus',
    'reportDate',
    'merchantSettleDate',
    'merchantSettleTime',
    'terminalId',
    'transDate',
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


  let reformatArray = array.map((record) => {
    return ({
      EDCBatchNumber: Number(record.EDCBatchNumber),
      MDR: Number(record.MDR),
      MDRAmount: Number(record.MDRAmount),
      approvalCode: record.approvalCode,
      cardNumber: record.cardNumber,
      cardType: record.cardType,
      transDate: String(record.transDate).trim() ? moment(record.transDate, 'YYYYMMDD').format('YYYY-MM-DD') : undefined,
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
      transactionTime: String(record.transactionTime).trim() ? moment(record.transactionTime, 'HHmmss').format('HH:mm:ss') : undefined
    })
  })

  reformatArray = reformatArray.filter(filtered => !String(filtered.recordSource).includes('RC')
    && !String(filtered.recordSource).includes('UD')
    && !String(filtered.recordSource).includes('UC')
    && !String(filtered.recordSource).includes('SF')
    && !String(filtered.recordSource).includes('AF')
    && !String(filtered.recordSource).includes('AD')
    && !String(filtered.recordSource).includes('SC')
    && !String(filtered.recordSource).includes('SD')
    && !String(filtered.recordSource).includes('AC')
    && !String(filtered.recordSource).includes('AS')
  )
  console.log('reformatArray', reformatArray.filter(filtered => !filtered.transDate || !filtered.transactionTime))

  currentArray = reformatArray.map((record) => {
    let type

    if (String(record.recordSource).includes('TD')
      || String(record.recordSource).includes('TF')) {
      type = 'D'
    }

    if (String(record.recordSource).includes('TC')
      || String(record.recordSource).includes('PC')) {
      type = 'K'
    }

    if (String(record.recordSource).includes('TQ')) {
      type = 'QR'
    }

    return ({
      approvalCode: record.approvalCode,
      edcBatchNumber: record.EDCBatchNumber,
      merchantId: record.merchantId,
      merchantName: record.merchantName,
      mdrAmount: record.MDRAmount,
      recordSource: record.recordSource,
      grossAmount: record.grossAmount,
      redeemAmount: record.redeemAmount,
      transDate: record.transDate,
      transTime: record.transactionTime,
      type,
      bank: 'BCA'
    })
  })
}

const FormAutoCounter = ({
  listAccountCode,
  loading,
  importCSV,
  accountId,
  from,
  to,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      onSubmit({
        accountId: data.accountId,
        from: moment(data.rangePicker[0]).format('YYYY-MM-DD'),
        to: moment(data.rangePicker[1]).format('YYYY-MM-DD')
      })
    })
  }

  const handleImport = () => {
    if (currentArray.length < 1) {
      message.error('This feature is not supported to this bank.')
      return
    }
    importCSV(currentArray)
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
        <FormItem label="Account">
          {getFieldDecorator('accountId', {
            initialValue: accountId ? Number(accountId) : (listAccountCode && listAccountCode.length > 0 ? listAccountCode[0].id : undefined),
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(<Select
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={filterOption}
          >{listAccountOpt}
          </Select>)}
        </FormItem>
        <LocaleProvider locale={enUS}>
          <FormItem label="Date">
            {getFieldDecorator('rangePicker', {
              initialValue: from && to ? [moment(from, 'YYYY-MM-DD'), moment(to, 'YYYY-MM-DD')] : null,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(
              <RangePicker size="large" />
            )}
          </FormItem>
        </LocaleProvider>
        <FormItem label="Csv File" hasFeedback>
          {getFieldDecorator('file')(
            <input type="file" accept=".csv" onChange={handleOnChange} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" icon="download" onClick={handleImport} loading={loading && loading.effects['bankentry/importCsv']} disabled={!getFieldsValue().file}>Import</Button>
          <Button type="primary" icon="check" onClick={handleSubmit} loading={loading && loading.effects['bankentry/importCsv']}>Start Reconciliation</Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default Form.create()(FormAutoCounter)
