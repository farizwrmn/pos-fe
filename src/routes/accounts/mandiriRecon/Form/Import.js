import React from 'react'
import { Form, message, Modal } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

let currentArray = []
let filename = ''

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
      EDCBatchNumber: Number(record.EDCBatchNumber) || 0,
      MDR: Number(record.MDR) || 0,
      MDRAmount: Number(record.MDRAmount) || 0,
      approvalCode: record.approvalCode,
      cardNumber: record.cardNumber,
      cardType: record.cardType,
      transDate: String(record.transDate).trim() ? moment(record.transDate, 'YYYYMMDD').format('YYYY-MM-DD') : undefined,
      grossAmount: Number(record.grossAmount) || 0,
      groupId: record.groupId,
      indicator: record.indicator,
      merchantId: Number(record.merchantId) || 0,
      merchantName: String(record.merchantName).trim(),
      merchantPaymentDate: record.merchantPaymentDate,
      merchantPaymentStatus: record.merchantPaymentStatus,
      merchantSettleDate: record.merchantSettleDate,
      nettAmount: Number(record.nettAmount) || 0,
      originalAmount: Number(record.originalAmount) || 0,
      recordSource: record.recordSource,
      redeemAmount: Number(record.redeemAmount) || 0,
      reportDate: record.reportDate,
      rewardAmount: Number(record.rewardAmount) || 0,
      sequenceNumber: Number(record.sequenceNumber) || 0,
      terminalId: Number(record.terminalId) || 0,
      traceNumber: Number(record.traceNumber),
      transactionCode: record.transactionCode,
      transactionDate: record.transactionDate,
      transactionTime: record.transactionTime
    })
  })


  reformatArray = reformatArray.filter(filtered =>
    String(filtered.recordSource).trim() === 'DEBIT-MANDIRI'
    || String(filtered.recordSource).trim() === 'KREDIT-MANDIRI'
    || String(filtered.recordSource).trim() === 'QRIS-MANDIRI'
  )

  currentArray = reformatArray.map((record) => {
    let type

    if (String(record.recordSource).trim() === 'DEBIT-MANDIRI'
      || String(record.recordSource).trim() === 'KREDIT-MANDIRI'
      || String(record.recordSource).trim() === 'QRIS-MANDIRI') {
      type = 'MND'
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
      bank: 'MANDIRI'
    })
  })
}

const FormImport = ({
  loading,
  importCSV,
  modalVisible,
  onCloseModal,
  form: {
    getFieldDecorator,
    validateFields
  }
}) => {
  const handleImport = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      if (currentArray.length < 1) {
        message.error('No data to be imported.')
        return
      }
      if (!filename) {
        message.error('File name is not defined.')
        return
      }
      importCSV(currentArray, filename)
    })
  }

  const fileReader = new FileReader()
  const handleOnChange = (event) => {
    const file = event.target.files[0]
    filename = file.name
    fileReader.onload = function (event) {
      const text = event.target.result
      convertCSVtoArray(text)
    }

    fileReader.readAsText(file)
  }

  const modalProps = {
    title: 'Import CSV',
    visible: modalVisible,
    confirmLoading: loading.effects['autorecon/importCsv'],
    okText: 'Import',
    onOk () {
      handleImport()
    },
    onCancel () {
      onCloseModal()
    }
  }

  return (
    <Modal {...modalProps} >
      <Form>
        <FormItem label="Csv File" hasFeedback>
          {getFieldDecorator('file', {
            rules: [
              {
                required: true,
                message: '* Required'
              }
            ]
          })(
            <input type="file" accept=".csv" onChange={handleOnChange} />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(FormImport)
