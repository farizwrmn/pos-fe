import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Col, Row, Button, Collapse, Select, DatePicker } from 'antd'
import moment from 'moment'
import Browse from './Browse'
import ModalBrowse from './ModalBrowse'
import PurchaseList from './PurchaseList'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 },
  style: { marginBottom: 5 },
}
const formItemLayout1 = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 },
}

const PurchaseForm = ({ rounding, onOk, onChangeRounding, transNo, handleBrowseInvoice, handleBrowseProduct, modalProductVisible, modalPurchaseVisible, form: { getFieldDecorator, getFieldsValue, validateFields, resetFields }, ...purchaseProps }) => {
  let dataPurchase = localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail'))
  const confirmPurchase = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(transNo, dataPurchase, data)
      resetFields()
    })
  }
  let g = dataPurchase
  let nettoTotal = g.reduce((cnt, o) => cnt + o.total + o.ppn, 0) + parseFloat(rounding)
  let totalPpn = g.reduce((cnt, o) => cnt + o.ppn, 0)
  let discPercent = g.reduce((cnt, o) => cnt + ((o.disc1 * o.qty * o.price) / 100), 0)
  let discNominal = g.reduce((cnt, o) => cnt + (o.discount * o.qty), 0)
  let totalDisc = parseFloat(discNominal) + parseFloat(discPercent)
  let grandTotal = g.reduce((cnt, o) => cnt + (o.price * o.qty), 0)
  const hdlBrowseProduct = () => {
    handleBrowseProduct()
  }
  const hdlBrowseInvoice = () => {
    handleBrowseInvoice()
  }
  const hdlChangeRounding = (e) => {
    const { value } = e.target
    onChangeRounding(value)
  }
  return (
    <Form style={{ padding: 3 }}>
      <Row style={{ padding: '10px' }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={14}>
              <FormItem label="Invoice No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transNo', {
                  initialValue: transNo === null ? '' : transNo.transNo,
                  rules: [{
                    required: true,
                    message: 'Required',
                    pattern: /^[a-z0-9/-]{6,25}$/i,
                  }],
                })(<Input maxLength={25} disabled />)}
              </FormItem>
              <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxType', {
                  initialValue: transNo === null ? '' : transNo.taxType,
                  rules: [{
                    required: true,
                    message: 'Required',
                  }],
                })(<Select disabled>
                  <Option value="I">Include</Option>
                  <Option value="E">Exclude</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={14}>
              <FormItem label="Invoice Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transDate', {
                  initialValue: transNo === null ? '' : moment.utc(transNo.transDate, 'YYYY-MM-DD'),
                  rules: [{
                    required: true,
                    message: 'Required',
                  }],
                })(<DatePicker disabled />)}
              </FormItem>
              <FormItem label="Payment Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('invoiceType', {
                  initialValue: transNo === null ? '' : transNo.invoiceType,
                  rules: [{
                    required: true,
                    message: 'Required',
                  }],
                })((<Select disabled>
                  <Option value="C">CASH</Option>
                  <Option value="K">KREDIT</Option>
                </Select>))}
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ padding: '10px' }}>
        <Col span={12}>
          <Button type="primary" size="large" icon="plus-square-o" onClick={() => hdlBrowseInvoice()} style={{ marginRight: '5px', marginBottom: '5px' }}>INVOICE</Button>
          <Button size="large" type="primary" onClick={() => hdlBrowseProduct()}>Product</Button>
          {modalProductVisible && <ModalBrowse {...purchaseProps} />}
        </Col>
      </Row>
      <Browse {...purchaseProps} />
      {modalPurchaseVisible && <PurchaseList {...purchaseProps} />}
      <div style={{ float: 'right' }}>
        <Row>
          <FormItem label="Total" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={grandTotal} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="PPN" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={totalPpn} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Total Discount" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={totalDisc} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Rounding" hasFeedback style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }} {...formItemLayout1}>
            {getFieldDecorator('rounding', {
              initialValue: rounding,
              rules: [{
                required: false,
              }],
            })((<Input onChange={_value => hdlChangeRounding(_value)} />))}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Netto Total" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={nettoTotal} />
          </FormItem>
        </Row>
      </div>
      <div style={{ marginBottom: '150px' }}>
        <Button type="primary" size="large" onClick={confirmPurchase} style={{ marginBottom: 2, marginTop: 10 }}>Submit</Button>
      </div>
    </Form>
  )
}

PurchaseForm.propTypes = {
  form: PropTypes.isRequired,
  location: PropTypes.isRequired,
  transNo: PropTypes.isRequired,
  onOk: PropTypes.func.isRequired,
  handleBrowseProduct: PropTypes.func.isRequired,
  handleBrowseInvoice: PropTypes.func.isRequired,
  modalProductVisible: PropTypes.isRequired,
  modalPurchaseVisible: PropTypes.isRequired,
}

export default Form.create()(PurchaseForm)
