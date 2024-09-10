import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Checkbox, Col, Row, Button, Modal, Select, DatePicker } from 'antd'
import moment from 'moment'
import { getVATPercentage, getDenominatorDppInclude, getDenominatorPPNInclude, getDenominatorPPNExclude } from 'utils/tax'
import { lstorage, numberFormat, alertModal } from 'utils'
import { prefix } from 'utils/config.main'
import Browse from './Browse'
import ModalBrowse from './ModalBrowse'
import PurchaseList from './PurchaseList'

const { checkPermissionMonthTransaction } = alertModal
const { formatNumberIndonesia } = numberFormat

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 15 }
  },
  style: { marginBottom: 5 }
}
const formItemLayout1 = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 }
}

const PurchaseForm = ({ onChooseInvoice, user, onDiscPercent, listSupplier, showSupplier, disableButton, dataBrowse, rounding, onOk, onChangeRounding, transNo, handleBrowseInvoice, handleBrowseProduct, handleBrowseVoid, modalProductVisible, modalPurchaseVisible, form: { getFieldDecorator, getFieldsValue, validateFields, resetFields, getFieldValue }, ...purchaseProps }) => {
  let defaultRole = (lstorage.getStorageKey('udi')[2] || '')
  const allowedRole = defaultRole === 'SFC' || defaultRole === 'ADF' || defaultRole === 'HFC'
  const {
    onInvoiceHeader
  } = purchaseProps
  const getDiscTotal = (g) => {
    const data = { ...getFieldsValue() }
    let total = g.reduce((cnt, o) => cnt + (o.qty * o.price), 0)
    let discPercent = g.reduce((cnt, o) => cnt + (o.disc1 * o.qty * (o.price / 100)), 0)
    let discNominal = g.reduce((cnt, o) => cnt + (o.discount), 0)
    let invoicePercent = (total - discPercent - discNominal) * ((data.discInvoicePercent || 0) / 100)
    let discTotal = (data.discInvoiceNominal || 0) + invoicePercent + discNominal + discPercent
    return discTotal
  }
  const getGrandTotal = (g) => {
    const grandTotal = g.reduce((cnt, o) => cnt + (o.qty * o.price), 0)
    return grandTotal
  }
  const getNettoTotal = (totalDpp, e, totalPpn) => {
    const nettoTotal = totalDpp + (parseFloat(e) || 0) + totalPpn
    return nettoTotal
  }
  let dataPurchase = dataBrowse
  let g = dataPurchase
  let totalPpn = g.reduce((cnt, o) => cnt + o.ppn, 0)
  let totalDpp = g.reduce((cnt, o) => cnt + o.dpp, 0)
  let totalDisc = getDiscTotal(g)
  let grandTotal = getGrandTotal(g)
  let nettoTotal = getNettoTotal(totalDpp, rounding, totalPpn)
  let dataVoid = localStorage.getItem('purchase_void') === null ? [] : JSON.parse(localStorage.getItem('purchase_void'))
  const hdlChangePercent = () => {
    console.log('change')
    const data = { ...getFieldsValue() }
    let dataProduct = localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : []
    let ppnType = data.taxType
    localStorage.setItem('taxType', ppnType)
    const totalPrice = dataProduct.reduce((prev, next) => prev + ((((next.qty * next.price) * (1 - ((next.disc1 / 100)))) - next.discount) * (1 - (data.discInvoicePercent / 100))), 0)
    const x = dataProduct
    for (let key = 0; key < x.length; key += 1) {
      const total = (x[key].qty * x[key].price)
      const discItem = ((((x[key].qty * x[key].price) * (1 - ((x[key].disc1 / 100)))) - x[key].discount) * (1 - (data.discInvoicePercent / 100)))
      const totalDpp = parseFloat(discItem - ((total / (totalPrice === 0 ? 1 : totalPrice)) * data.discInvoiceNominal))
      x[key].portion = totalPrice > 0 ? discItem / totalPrice : 0
      if (data.deliveryFee && data.deliveryFee !== '' && data.deliveryFee > 0) {
        x[key].deliveryFee = x[key].portion * data.deliveryFee
      } else {
        x[key].deliveryFee = 0
      }
      x[key].dpp = parseFloat(totalDpp / (ppnType === 'I' ? getDenominatorDppInclude() : 1))
      x[key].ppn = parseFloat((ppnType === 'I' ? totalDpp / getDenominatorPPNInclude() : ppnType === 'S' ? (x[key].dpp * getDenominatorPPNExclude()) : 0))
      x[key].total = parseFloat(x[key].dpp + x[key].ppn)
    }
    localStorage.setItem('product_detail', JSON.stringify(x))
    onDiscPercent(x, data)
  }
  const confirmPurchase = () => {
    const checkPermission = checkPermissionMonthTransaction(transNo.transDate)
    if (checkPermission) {
      return
    }
    hdlChangePercent()
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      if (data.supplierCode) {
        data.supplierName = data.supplierCode.label
        data.supplierCode = data.supplierCode.key
      }
      const newDataPurchase = localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : []
      onOk(transNo, newDataPurchase, dataVoid, data)
      resetFields()
    })
  }
  const hdlBrowseProduct = () => {
    const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
    if (!transNo.transNo) {
      Modal.warning({
        title: 'Cannot Find Invoice',
        content: 'Choose Invoice first'
      })
    } else if (transNo.transDate < storeInfo.startPeriod) {
      Modal.warning({
        title: 'Read-only Invoice',
        content: 'This Invoice cannot be edit'
      })
    } else {
      handleBrowseProduct()
    }
  }
  const hdlBrowseVoid = () => {
    handleBrowseVoid()
  }
  const hdlBrowseInvoice = () => {
    handleBrowseInvoice()
    let startPeriod = moment().startOf('month').format('YYYY-MM-DD')
    let endPeriod = moment().endOf('month').format('YYYY-MM-DD')
    const period = {
      startPeriod,
      endPeriod
    }
    onInvoiceHeader(period)
  }
  const hdlChangeRounding = (e) => {
    const { value } = e.target
    onChangeRounding(value)
  }
  const browseProps = {
    transNo,
    ...purchaseProps
  }

  const purchaseOpts = {
    onChooseInvoice (item) {
      resetFields()
      onChooseInvoice(item)
    },
    ...purchaseProps
  }

  const brand = () => {
    showSupplier()
  }

  const supplierData = (listSupplier || []).length > 0 ? listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>) : []

  return (
    <Form style={{ padding: 3 }}>
      <Row style={{ padding: '10px' }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row>
            <Col xs={24} sm={12} md={12} lg={12} xl={14}>
              <FormItem label="Form No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transNo', {
                  initialValue: transNo.transNo,
                  rules: [{
                    required: true,
                    message: 'Required',
                    pattern: /^[a-z0-9/.,_"'-]{6,30}$/i
                  }]
                })(<Input disabled maxLength={30} />)}
              </FormItem>
              <FormItem label="Reference" hasFeedback {...formItemLayout}>
                {getFieldDecorator('reference', {
                  initialValue: transNo.reference,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input maxLength={30} />)}
              </FormItem>
              <FormItem label="Invoice Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transDate', {
                  initialValue: transNo.transDate ? moment.utc(transNo.transDate, 'YYYY-MM-DD') : null,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<DatePicker disabled={!(
                  user.permissions.role === 'SPR'
                  || user.permissions.role === 'OWN'
                  || user.permissions.role === 'ITS'
                  || user.permissions.role === 'HPC'
                  || user.permissions.role === 'SPC'
                  || user.permissions.role === 'HFC'
                  || user.permissions.role === 'SFC'
                ) || allowedRole}
                />)}
              </FormItem>
              <FormItem label="Supplier" hasFeedback {...formItemLayout}>
                {getFieldDecorator('supplierCode', {
                  initialValue: transNo.supplierCode ? {
                    key: transNo.supplierCode,
                    label: transNo.supplierName
                  } : {},
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  showSearch
                  onFocus={() => brand()}
                  onBlur={hdlChangePercent}
                  optionFilterProp="children"
                  labelInValue
                  disabled={allowedRole}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >{supplierData}
                </Select>)}
              </FormItem>
              <FormItem label="Disc Inv(%)" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discInvoicePercent', {
                  initialValue: transNo.discInvoicePercent,
                  rules: [{
                    required: true,
                    pattern: /^([0-9.-]{0,5})$/i,
                    message: 'Required'
                  }]
                })(<InputNumber
                  onBlur={hdlChangePercent}
                  defaultValue={0}
                  step={10}
                  max={100}
                  disabled={allowedRole}
                  min={0}
                />)}
              </FormItem>
              <FormItem label="Disc NML(N)" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discInvoiceNominal', {
                  initialValue: transNo.discInvoiceNominal,
                  rules: [{
                    required: true,
                    pattern: /^([0-9.-]{0,19})$/i,
                    message: 'Required'
                  }]
                })(<InputNumber
                  onBlur={hdlChangePercent}
                  defaultValue={0}
                  step={500}
                  disabled={allowedRole}
                  min={0}
                />)}
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={14}>
              {/* <FormItem label="Payment Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('invoiceType', {
                  initialValue: transNo.invoiceType,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })((<Select disabled>
                  <Option value="C">CASH</Option>
                  <Option value="K">KREDIT</Option>
                </Select>))}
              </FormItem> */}
              <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxType', {
                  initialValue: transNo.taxType,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Select onBlur={hdlChangePercent}>
                  <Option value="I">Include</Option>
                  <Option value="E">Exclude (0%)</Option>
                  <Option value="S">Exclude ({getVATPercentage()}%)</Option>
                </Select>)}
              </FormItem>
              <FormItem label="Is Tax Invoice" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxInvoice', {
                  initialValue: Boolean(transNo.taxInvoice),
                  valuePropName: 'checked'
                })(<Checkbox />)}
              </FormItem>
              <FormItem label="Tax Invoice" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxInvoiceNo', {
                  initialValue: transNo.taxInvoiceNo,
                  rules: [{
                    required: false,
                    message: 'Required',
                    pattern: /^[a-z0-9./-]{6,25}$/i
                  }]
                })(<Input maxLength={25} placeholder="Tax Invoice No" />)}
              </FormItem>
              <FormItem label="Tax Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxDate', {
                  initialValue: transNo.taxDate ? moment.utc(transNo.taxDate, 'YYYY-MM-DD') : null,
                  rules: [{
                    required: false,
                    message: 'Required'
                  }]
                })(<DatePicker />)}
              </FormItem>
              <FormItem label="Receive Date" {...formItemLayout}>
                {getFieldDecorator('receiveDate', {
                  initialValue: transNo.receiveDate ? moment.utc(transNo.receiveDate, 'YYYY-MM-DD') : null,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<DatePicker disabled={!(user.permissions.role === 'SPR'
                  || user.permissions.role === 'OWN'
                  || user.permissions.role === 'ITS'
                  || user.permissions.role === 'HPC'
                  || user.permissions.role === 'SPC'
                  || user.permissions.role === 'HFC'
                  || user.permissions.role === 'SFC'
                ) || allowedRole}
                />)}
              </FormItem>
              <FormItem label="Delivery Fee" hasFeedback {...formItemLayout}>
                {getFieldDecorator('deliveryFee', {
                  initialValue: transNo.deliveryFee,
                  rules: [{
                    required: true,
                    pattern: /^([0-9.-]{0,19})$/i,
                    message: 'Required'
                  }]
                })(<InputNumber disabled={allowedRole} onBlur={hdlChangePercent} defaultValue={0} step={500} min={0} />)}
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ padding: '10px' }}>
        <Col span={24}>
          <Button type="primary" size="large" icon="plus-square-o" onClick={() => hdlBrowseInvoice()} style={{ marginRight: '5px', marginBottom: '5px' }}>INVOICE</Button>
          {!allowedRole && <Button size="large" type="primary" onClick={() => hdlBrowseProduct()}>Product</Button>}
          <ModalBrowse {...purchaseOpts} />
          {!allowedRole && <Button size="large" type="primary" onClick={() => hdlBrowseVoid()} style={{ float: 'right' }}>Void List</Button>}
        </Col>
      </Row>
      {!allowedRole && <Browse {...browseProps} />}
      {modalPurchaseVisible && <PurchaseList {...purchaseProps} />}
      <div style={{ float: 'right' }}>
        <Row>
          <FormItem label="Total" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(grandTotal)} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Total Dpp" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(parseFloat(totalDpp))} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="PPN" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(totalPpn)} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Total Discount" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(totalDisc)} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Rounding" hasFeedback style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }} {...formItemLayout1}>
            {getFieldDecorator('rounding', {
              initialValue: rounding,
              rules: [{
                pattern: /^([0-9.-]{0,5})$/i,
                message: 'Rounding is not defined',
                required: true
              }]
            })((<Input disabled={transNo.readOnly || allowedRole} onBlur={hdlChangePercent} onChange={_value => hdlChangeRounding(_value)} />))}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Delivery Fee" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(parseFloat(getFieldValue('deliveryFee')))} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Netto Total" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(parseFloat(nettoTotal) + parseFloat(getFieldValue('deliveryFee') !== '' && getFieldValue('deliveryFee') != null ? getFieldValue('deliveryFee') : 0))} />
          </FormItem>
        </Row>
      </div>
      <div style={{ marginBottom: '150px' }}>
        <Button disabled={(disableButton || false) || (transNo.readOnly)} type="primary" size="large" onClick={confirmPurchase} style={{ marginBottom: 2, marginTop: 10 }}>Submit</Button>
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
  handleBrowseVoid: PropTypes.func.isRequired,
  handleBrowseInvoice: PropTypes.func.isRequired,
  modalProductVisible: PropTypes.isRequired,
  modalPurchaseVisible: PropTypes.isRequired
}

export default Form.create()(PurchaseForm)
