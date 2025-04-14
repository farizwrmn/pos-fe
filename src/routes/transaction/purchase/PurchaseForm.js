import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Checkbox, message, Form, Modal, Input, Select, InputNumber, Collapse, Table, Col, Row, Button } from 'antd'
import moment from 'moment'
import { numberFormat, alertModal } from 'utils'
import { getVATPercentage, getDenominatorDppInclude, getDenominatorPPNInclude, getDenominatorPPNExclude } from 'utils/tax'
import { prefix } from 'utils/config.main'
import ModalPurchaseOrder from './ModalPurchaseOrder'
import ListDetail from './ListDetail'
import ModalProduct from './ModalProduct'
import ModalSupplier from './ModalSupplier'

const { checkPermissionMonthTransaction } = alertModal

const { formatNumberIndonesia } = numberFormat

const Panel = Collapse.Panel
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  style: { marginBottom: 5 }
}
const formItemLayout1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 11 }
}
const PurchaseForm = ({
  listSelectedPurchaseOrder,
  modalPurchaseOrderProps,
  lastTrans,
  handlePurchaseOrder,
  onDiscPercent,
  paginationSupplier,
  disableButton,
  rounding,
  onChangeRounding,
  listDetailProps,
  onOk,
  onChooseSupplier,
  handleBrowseProduct,
  modalProductVisible,
  modalSupplierVisible,
  searchTextSupplier,
  supplierInformation,
  listSupplier,
  onGetSupplier,
  tmpSupplierData,
  onSearchSupplier,
  onSearchSupplierData,
  date,
  tempo,
  loading,
  onChangeDate,
  modalListProductProps,
  form: { getFieldDecorator, getFieldValue, getFieldsValue, validateFields, resetFields, setFieldsValue },
  dispatch
}) => {
  const getDiscTotal = (g) => {
    const data = {
      ...getFieldsValue()
    }
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
  let dataPurchase = (localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail')))
  let g = dataPurchase
  let realTotal = g.reduce((cnt, o) => cnt + (o.qty * o.price), 0)
  let totalPpn = g.reduce((cnt, o) => cnt + o.ppn, 0)
  let totalDpp = g.reduce((cnt, o) => cnt + o.dpp, 0)
  let totalDisc = getDiscTotal(g)
  let grandTotal = getGrandTotal(g)
  let nettoTotal = getNettoTotal(totalDpp, rounding, totalPpn)
  const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 24,
    border: 0
  }
  const hdlDateChange = (e) => {
    if (e) {
      let a = e.format('YYYY-MM-DD')
      onChangeDate(moment(a, 'YYYY-MM-DD').add(getFieldValue('tempo'), 'days').format('YYYY-MM-DD'))
    } else {
      onChangeDate(null)
    }
  }

  const hdlChangePercent = () => {
    const data = {
      ...getFieldsValue()
    }
    let dataProduct = localStorage.getItem('product_detail') ? JSON.parse(localStorage.getItem('product_detail')) : []
    let ppnType = data.taxType
    localStorage.setItem('taxType', ppnType)
    const totalPrice = dataProduct.reduce((prev, next) => prev + ((((next.qty * next.price) * (1 - ((next.disc1 / 100)))) - next.discount) * (1 - (data.discInvoicePercent / 100))), 0)
    const x = dataProduct
    for (let key = 0; key < x.length; key += 1) {
      const total = (x[key].qty * x[key].price)
      const discItem = ((((x[key].qty * x[key].price) * (1 - ((x[key].disc1 / 100)))) - x[key].discount) * (1 - (data.discInvoicePercent / 100)))
      x[key].portion = totalPrice > 0 ? discItem / totalPrice : 0
      const totalDpp = parseFloat(discItem - ((total / (totalPrice === 0 ? 1 : totalPrice)) * data.discInvoiceNominal))
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

  const onChange = (e) => {
    const { value } = e.target
    let a = getFieldValue('transDate')
    let add = moment(a, 'YYYY-MM-DD').add(value, 'days')
    onChangeDate(moment(add).format('YYYY-MM-DD'))
  }
  const hdlSearch = (e) => {
    onSearchSupplier(e, tmpSupplierData)
  }
  const hdlSearchPagination = (page) => {
    const query = {
      q: searchTextSupplier,
      page: page.current,
      pageSize: page.pageSize
    }
    onSearchSupplierData(query)
  }
  const hdlGetSupplier = () => {
    onGetSupplier()
    dispatch({
      type: 'purchase/updateState',
      payload: {
        modalSupplierVisible: true
      }
    })
  }

  const modalSupplierProps = {
    title: 'Supplier',
    visible: modalSupplierVisible,
    footer: null,
    hdlSearch,
    onCancel () {
      dispatch({
        type: 'purchase/updateState',
        payload: {
          modalSupplierVisible: false
        }
      })
    }
  }

  const buttonSupplierProps = {
    type: 'primary',
    onClick () {
      hdlGetSupplier()
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: '20%'
    },
    {
      title: 'Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: '45%'
    },
    {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01',
      width: '45%'
    }
  ]
  const handleMenuClick = (record) => {
    let a = getFieldValue('transDate')
    onChooseSupplier(record)
    dispatch({
      type: 'purchase/updateState',
      payload: {
        modalSupplierVisible: false
      }
    })
    if (record.paymentTempo) {
      message.success(`Supplier ${record.supplierName}  ${record.paymentTempo ? `has ${record.paymentTempo} ${parseFloat(record.paymentTempo) > 1 ? 'days' : 'day'}` : ''} tempo`)
      setFieldsValue({ tempo: record.paymentTempo })
      if (a) {
        onChangeDate(moment(a).add(record.paymentTempo, 'days').format('YYYY-MM-DD'))
      }
    }
  }
  const hdlBrowseProduct = () => {
    handleBrowseProduct()
  }
  const hdlChangeRounding = (e) => {
    const { value } = e.target
    onChangeRounding(value)
  }
  const confirmPurchase = () => {
    hdlChangePercent()
    validateFields((errors) => {
      if (errors) {
        return
      }
      const suppinfo = !!supplierInformation.id
      if (!suppinfo) {
        Modal.warning({
          title: 'Supplier Information',
          content: 'Supplier Information Not Found'
        })
        return
      }
      const startPeriod = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)).startPeriod : {}
      if (!(supplierInformation && supplierInformation.id)) {
        message.error('Supplier information is required')
        return
      }
      const data = {
        ...getFieldsValue(),
        supplierCode: supplierInformation.id,
        supplierName: supplierInformation.supplierName,
        dueDate: date,
        invoiceTotal: parseInt(grandTotal, 10),
        nettoTotal: parseInt(realTotal, 10) + parseInt(grandTotal, 10),
        totalDPP: parseInt(totalDpp, 10) - parseInt(totalDisc, 10),
        totalPPN: parseInt(totalPpn, 10),
        discTotal: totalDisc
      }
      const transDate = moment(data.transDate).format('YYYY-MM-DD')
      const formattedStartPeriod = moment(startPeriod).format('YYYY-MM-DD')

      const checkPermission = checkPermissionMonthTransaction(transDate)
      if (checkPermission) {
        return
      }
      if (transDate >= formattedStartPeriod) {
        onOk(data, resetFields)
      } else {
        Modal.warning({
          title: 'Period has been closed',
          content: 'This period has been closed'
        })
      }
    })
  }
  return (
    <Form style={{ padding: 3 }}>
      <Row>
        <Col xs={24} sm={24} md={15} lg={12} xl={12}>
          <Collapse stylebordered={false} bordered={false} defaultActiveKey={['1', '2']}>
            <Panel header="Invoice Information" key="1" style={customPanelStyle}>
              <Row>
                <Col md={24} lg={14}>
                  <FormItem label="Form No" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('transNo', {
                      initialValue: lastTrans,
                      rules: [{
                        required: true,
                        message: 'Required',
                        pattern: /^[a-z0-9/.,_"'-]{6,30}$/i
                      }]
                    })(<Input disabled maxLength={30} />)}
                  </FormItem>
                  <FormItem label="Invoice Number" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('reference', {
                      rules: [{
                        required: true,
                        message: 'Required'
                      }]
                    })(<Input maxLength={30} />)}
                  </FormItem>
                  <FormItem label="PO Number" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('referencePO', {
                      rules: [{
                        required: true,
                        message: 'Required'
                      }]
                    })(<Input maxLength={30} />)}
                  </FormItem>
                  <FormItem required label="Search" {...formItemLayout}>
                    <Button {...buttonSupplierProps} size="default">{supplierInformation && supplierInformation.supplierName ? `${supplierInformation.supplierName.substring(0, 12)}${supplierInformation.address01 ? ` - ${supplierInformation.address01.substring(0, 10)}` : ''}` : 'Search Supplier'}</Button>
                  </FormItem>
                  <FormItem label="Disc Invoice(%)" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('discInvoicePercent', {
                      initialValue: 0,
                      rules: [{
                        required: false,
                        pattern: /^([0-9.-]{0,5})$/i,
                        message: 'Required'
                      }]
                    })(<InputNumber onBlur={hdlChangePercent} size="large" min={0} max={100} step={10} defaultValue={0} />)}
                  </FormItem>
                  <FormItem label="Disc Invoice(N)" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('discInvoiceNominal', {
                      initialValue: 0,
                      rules: [{
                        required: false,
                        pattern: /^([0-9.-]{0,19})$/i,
                        message: 'Required'
                      }]
                    })(<InputNumber onBlur={hdlChangePercent} defaultValue={0} step={500} min={0} />)}
                  </FormItem>
                </Col>
                <Col md={24} lg={10}>
                  <FormItem label="Invoice Date" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('transDate', {
                      rules: [{
                        required: true,
                        message: 'Required'
                      }]
                    })(<DatePicker onChange={_value => hdlDateChange(_value)} />)}
                  </FormItem>
                  <FormItem label="Tempo" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('tempo', {
                      initialValue: tempo,
                      rules: [{
                        required: true,
                        message: 'Required',
                        pattern: /^\d+$/gi
                      }]
                    })(<Input maxLength={5} onChange={_value => onChange(_value)} />)}
                  </FormItem>
                  <FormItem label="Due Date" hasFeedback {...formItemLayout}>
                    <Input disabled value={date} />
                  </FormItem>
                  <FormItem label="Delivery Fee" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('deliveryFee', {
                      initialValue: 0,
                      rules: [{
                        required: true,
                        pattern: /^([0-9.-]{0,19})$/i,
                        message: 'Required'
                      }]
                    })(<InputNumber onBlur={hdlChangePercent} defaultValue={0} step={500} min={0} />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Col>
        <Col xs={24} sm={24} md={9} lg={12} xl={12}>
          <Collapse stylebordered={false} bordered={false} defaultActiveKey={['1']}>
            <Panel header="Advance Information" key="1" style={customPanelStyle}>
              <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxType', {
                  initialValue: localStorage.getItem('taxType') ? localStorage.getItem('taxType') : 'E',
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
                  valuePropName: 'checked'
                })(<Checkbox />)}
              </FormItem>
              <FormItem label="Tax Invoice" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxInvoiceNo', {
                  rules: [{
                    required: false,
                    message: 'Required',
                    pattern: /^[a-z0-9./-]{6,25}$/i
                  }]
                })(<Input maxLength={25} placeholder="Tax Invoice No" />)}
              </FormItem>
              <FormItem label="Tax Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxDate', {
                  rules: [{
                    required: false,
                    message: 'Required'
                  }]
                })(<DatePicker placeholder="Tax Date" />)}
              </FormItem>
              <FormItem label="Has Receive" hasFeedback {...formItemLayout}>
                {getFieldDecorator('receiveChecks', {
                  valuePropName: 'checked',
                  rules: [{
                    required: getFieldValue('receiveChecks'),
                    message: 'Required'
                  }]
                })(<Checkbox />)}
              </FormItem>
              {getFieldValue('receiveChecks') &&
                <FormItem label="Receive Date" {...formItemLayout}>
                  {getFieldDecorator('receiveDate', {
                    rules: [{
                      required: true,
                      message: 'Required'
                    }]
                  })(<DatePicker />)}
                </FormItem>}
            </Panel>
          </Collapse>
        </Col>
      </Row>
      <Row style={{ padding: 1 }}>
        <Col span={24}>
          {listSelectedPurchaseOrder && listSelectedPurchaseOrder.length === 0 && <Button type="default" size="large" style={{ marginRight: '10px', marginBottom: '10px' }} onClick={() => handlePurchaseOrder()}>Purchase Order</Button>}
          <Button type="primary" size="large" style={{ marginRight: '10px', marginBottom: '10px' }} onClick={() => hdlBrowseProduct()}>Product</Button>
          {modalProductVisible && <ModalProduct {...modalListProductProps} />}
          {modalSupplierVisible && (
            <ModalSupplier {...modalSupplierProps}>
              <Table
                bordered
                pagination={paginationSupplier}
                scroll={{ x: 500 }}
                columns={columns}
                simple
                loading={loading.effects['purchase/querySupplier']}
                dataSource={listSupplier}
                size="small"
                pageSize={10}
                onChange={hdlSearchPagination}
                onRowClick={_record => handleMenuClick(_record)}
              />
            </ModalSupplier>
          )}
        </Col>
      </Row>
      <ListDetail {...listDetailProps} />
      <div style={{ float: 'right' }}>
        <Row>
          <FormItem label="Total" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(parseFloat(grandTotal))} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Total Discount" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(parseFloat(totalDisc))} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Total Dpp" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(parseFloat(totalDpp))} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="PPN" {...formItemLayout1} style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={formatNumberIndonesia(parseFloat(totalPpn))} />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="Rounding" hasFeedback style={{ marginRight: 2, marginBottom: 2, marginTop: 2 }} {...formItemLayout1}>
            {getFieldDecorator('rounding', {
              initialValue: 0,
              rules: [{
                pattern: /^([0-9.-]{0,5})$/i,
                message: 'Rounding is not defined',
                required: true
              }]
            })((<Input maxLength={5} onChange={_value => hdlChangeRounding(_value)} />))}
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
        <Button type="primary" size="large" onClick={confirmPurchase} disabled={disableButton || false} style={{ marginBottom: 2, marginTop: 10 }}>Submit</Button>
      </div>
      {modalPurchaseOrderProps.visible && <ModalPurchaseOrder {...modalPurchaseOrderProps} />}
    </Form>
  )
}

PurchaseForm.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.objects,
  onGetSupplier: PropTypes.func,
  dataBrowse: PropTypes.array
}

export default Form.create()(PurchaseForm)
