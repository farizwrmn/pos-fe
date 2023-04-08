/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react'
import PropTypes from 'prop-types'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { Form, Input, Row, Col, message } from 'antd'
import ListItem from './ListItem'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  listItemProps,
  printProps,
  form: {
    getFieldDecorator
  }
}) => {
  const handleImportProduct = (event) => {
    let uploadData = []
    let transNo = null
    let invalidTransNo = 0
    let invalidQty = 0
    let invalidPrice = 0
    const fileName = event.target.files[0]
    const workbook = new Excel.Workbook()
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileName)
    reader.onload = () => {
      const buffer = reader.result
      workbook.xlsx.load(buffer)
        .then(async (workbook) => {
          const sheet = workbook.getWorksheet('POS 1')
          await sheet
            .eachRow({ includeEmpty: false }, (row, rowIndex) => {
              let startPoint = 3
              let reference = row.values[++startPoint]
              if (rowIndex >= 7) {
                if (transNo === reference || uploadData.length === 0) {
                  transNo = reference
                } else if (uploadData.length > 0) {
                  invalidTransNo = rowIndex + 1
                }
                const productCode = row.values[++startPoint]
                // eslint-disable-next-line no-unused-vars
                const productName = row.values[++startPoint]
                // eslint-disable-next-line no-unused-vars
                const qty = row.values[++startPoint]
                if (qty == null || Number(qty) <= 0) {
                  invalidQty = rowIndex + 1
                }
                if (qty == null || Number(qty) <= 0) {
                  invalidPrice = rowIndex + 1
                }
                const purchasePrice = row.values[++startPoint]
                // eslint-disable-next-line no-unused-vars
                const total = row.values[++startPoint]

                const data = {
                  productCode,
                  qty,
                  purchasePrice
                }
                uploadData.push(data)
              }
            })
        })
        .then(() => {
          if (invalidTransNo) {
            message.error(`Only allow 1 Trans No at once, at row: ${invalidTransNo}`)
            return
          }
          if (invalidQty) {
            message.error(`Invalid Qty, at row: ${invalidQty}`)
            return
          }
          if (invalidPrice) {
            message.error(`Invalid Price, at row: ${invalidPrice}`)
            return
          }
          if (uploadData && uploadData.length > 0) {
            onSubmit(transNo, uploadData)
          } else {
            message.error('No Data to Upload')
          }
        })
    }
  }

  const uploadProps = {
    name: 'file',
    processData: false
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="No. Transaction" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: item.transNo,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input disabled maxLength={60} />)}
          </FormItem>
          <FormItem label="Deadline Receive" {...formItemLayout}>
            {getFieldDecorator('expectedArrival', {
              initialValue: item.expectedArrival,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Input disabled />)}
          </FormItem>
        </Col>
      </Row>
      <PrintXLS data={listItemProps.dataSource} name="Export" {...printProps} />
      <span>
        <label style={{ marginTop: '10px', padding: '0.5em', float: 'right' }} htmlFor="submitQuotation" className="ant-btn ant-btn-primary ant-btn-lg">Import Quotation</label>
        <input
          id="submitQuotation"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="ant-btn ant-btn-primary ant-btn-lg"
          style={{ visibility: 'hidden', marginTop: '10px', float: 'right' }}
          {...uploadProps}
          onClick={(event) => {
            event.target.value = null
          }}
          onInput={(event) => {
            handleImportProduct(event)
          }}
        />
      </span>
      <ListItem {...listItemProps} />
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
