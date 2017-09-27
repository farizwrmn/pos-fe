import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Col, Row, Button, Icon } from 'antd'
import Browse from './Browse'
import ModalBrowse from './ModalBrowse'
import PurchaseList from './PurchaseList'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const formItemLayout1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 11 },
}
const PurchaseForm = ({ onOk, transNo, handleBrowseInvoice, handleBrowseProduct, modalProductVisible, modalPurchaseVisible, ...purchaseProps }) => {
  let dataPurchase = localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail'))
  const confirmPurchase = () => {
    onOk(transNo, dataPurchase)
  }
  let g = dataPurchase
  let nettoTotal = g.reduce((cnt, o) => cnt + o.total, 0)
  let totalPpn = g.reduce((cnt, o) => cnt + o.ppn, 0)
  let discPercent = g.reduce((cnt, o) => cnt + ((o.disc1 * o.qty * o.price) / 100), 0)
  let discNominal = g.reduce((cnt, o) => cnt + (o.discount * o.qty), 0)
  let totalDisc = parseFloat(discNominal) + parseFloat(discPercent)
  let grandTotal = g.reduce((cnt, o) => cnt + (o.price * o.qty), 0) - totalDisc
  const hdlBrowseProduct = () => {
    handleBrowseProduct()
  }
  const hdlBrowseInvoice = () => {
    handleBrowseInvoice()
  }

  return (
    <Form style={{ padding: 3 }}>
      <Row style={{ padding: '10px' }}>
        <Col span={12}>
          <Button type="primary" size="large" icon="plus-square-o" onClick={() => hdlBrowseInvoice()} style={{ marginRight: '5px' }}>INVOICE</Button>
          <Button size="large" type="primary" onClick={() => hdlBrowseProduct()}>Product</Button>
          {modalProductVisible && <ModalBrowse {...purchaseProps} />}
        </Col>
      </Row>
      <Browse {...purchaseProps} />
      {modalPurchaseVisible && <PurchaseList {...purchaseProps} />}
      <Row>
        <Col span="12">
          <Button type="primary" size="large" onClick={confirmPurchase} style={{ marginBottom: 2, marginTop: 10 }}>Submit</Button>
        </Col>
        <Col span="12">
          <FormItem label="Total" {...formItemLayout1} style={{ marginLeft: '50%', marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={grandTotal} />
          </FormItem>
          <FormItem label="PPN" {...formItemLayout1} style={{ marginLeft: '50%', marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={totalPpn} />
          </FormItem>
          <FormItem label="Total Discount" {...formItemLayout1} style={{ marginLeft: '50%', marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={totalDisc} />
          </FormItem>
          <FormItem label="Netto Total" {...formItemLayout1} style={{ marginLeft: '50%', marginBottom: 2, marginTop: 2 }}>
            <Input disabled value={nettoTotal} />
          </FormItem>
        </Col>
      </Row>
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
