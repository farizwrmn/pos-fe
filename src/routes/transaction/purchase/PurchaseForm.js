import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Form, Input, Select, InputNumber, Collapse, Popover, Table, Col, Row, Button, Icon } from 'antd'
import moment from 'moment'
import Browse from './Browse'
import ModalBrowse from './ModalBrowse'
import PurchaseList from './PurchaseList'

const { TextArea, Search } = Input
const Panel = Collapse.Panel
const FormItem = Form.Item
const Option = Select.Option
const ButtonGroup = Button.Group

const formItemLayout = {
  labelCol: { span: 11 },
  wrapperCol: { span: 12 },
  style: { marginBottom: 5 },
}
const formItemLayout1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 11 },
}
const PurchaseForm = ({onDiscPercent, rounding, onChangeRounding, dataBrowse, onResetBrowse, onDiscNominal, onOk, curDiscNominal, curDiscPercent, onChooseSupplier, onChangeDatePicker, onChangePPN, handleBrowseProduct,
                        modalProductVisible, modalPurchaseVisible, supplierInformation, listSupplier, onGetSupplier,
                         onChooseItem, tmpSupplierData, onSearchSupplier, date, tempo, datePicker,onChangeDate, form: { getFieldDecorator, getFieldsValue, validateFields, resetFields }, ...purchaseProps}) => {
  const confirmPurchase = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        supplierCode: supplierInformation.id,
        supplierName: supplierInformation.supplierName,
        dueDate: date,
        invoiceTotal: parseInt(grandTotal),
        nettoTotal: parseInt(realTotal) + parseInt(grandTotal),
        totalDPP: parseInt(totalDpp) - parseInt(totalDisc),
        totalPPN: parseInt(totalPpn),
        discTotal: totalDisc,
      }
      onOk(data)
      resetFields()
    })
  }
  let dataPurchase = (localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail')))
  let g = dataPurchase
  let nettoTotal = g.reduce((cnt, o) => cnt + o.total, 0) + parseFloat(rounding)
  let realTotal = g.reduce((cnt, o) => cnt + (o.qty * o.price), 0)
  let totalPpn = g.reduce((cnt, o) => cnt + o.ppn, 0)
  let totalDpp = g.reduce((cnt, o) => cnt + o.dpp, 0)
  let discPercent = g.reduce((cnt, o) => cnt + (o.disc1 * o.qty * (o.price / 100)), 0)
  let discNominal = g.reduce((cnt, o) => cnt + (o.discount * o.qty), 0)
  let totalDisc = parseFloat(discNominal) + parseFloat(discPercent)
  let grandTotal = g.reduce((cnt, o) => cnt + (o.price * o.qty), 0) - totalDisc
  const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
  }
  const hdlDateChange = (e) => {
    let a = e.format('YYYY-MM-DD')
    localStorage.setItem('setDate', a)
    const b = localStorage.getItem('setDate')
    onChangeDate(b)
  }

  const hdlChangePercent = (e) => {
    onDiscPercent(e)
  }

  const hdlChangeNominal = (e) => {
    onDiscNominal(e)
  }

  const onChange = (e) => {
    const { value } = e.target
    let a = localStorage.getItem('setDate')
    let add = moment(a, 'YYYY-MM-DD').add(value, 'd')
    onChangeDate(add.format('YYYY-MM-DD'))
  }
  const hdlSearch = (e) => {
    onSearchSupplier(e, tmpSupplierData)
  }
  const hdlGetSupplier = () => {
    onGetSupplier()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: '10%',
    },
    {
      title: 'Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: '45%',
    },
    {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01',
      width: '45%',
    },
  ]
  const handleMenuClick = (record) => {
    onChooseSupplier(record)
  }
  const hdlBrowseProduct = () => {
    handleBrowseProduct()
  }
  const hdlChangeRounding = (e) => {
    const { value } = e.target
    onChangeRounding(value)
  }
  const contentPopover = (
    <Table
      bordered
      pagination={false}
      scroll={{ x: 500, y: 100 }}
      columns={columns}
      simple
      dataSource={listSupplier}
      size="small"
      pageSize={5}
      rowKey={record => record.productCode}
      onRowClick={_record => handleMenuClick(_record)}
    />
  )
  const hdlPPN = (e) => {
    onChangePPN(e)
  }
  const resetProduct = () => {
    localStorage.removeItem('product_detail')
    onResetBrowse()
  }

  return (
    <Form style={{ padding: 3 }}>
      <Row>
        <Col xs={24} sm={24} md={10} lg={12} xl={14}>
          <Collapse stylebordered={false} bordered={false} defaultActiveKey={['1', '2']}>
            <Panel header="Invoice Information" key="1" style={customPanelStyle}>
              <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={14}>
                  <FormItem label="Invoice No" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('transNo', {
                      rules: [{
                        required: true,
                        message: 'Required',
                        pattern: /^[a-z0-9/-]{6,25}$/i,
                      }],
                    })(<Input maxLength={25} />)}
                  </FormItem>
                  <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('taxType', {
                      initialValue: localStorage.getItem('taxType') ? localStorage.getItem('taxType') : 'E',
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<Select onChange={(value) => hdlPPN(value)}>
                      <Option value="I">Include</Option>
                      <Option value="E">Exclude</Option>
                    </Select>)}
                  </FormItem>
                  <FormItem label="Disc Invoice(%)" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('discPercent', {
                      initialValue: 0,
                      rules: [{
                        required: false,
                        message: 'Required',
                      }],
                    })(<InputNumber onChange={_value => hdlChangePercent(_value)} size="large" min={0} max={100} step={0.1} defaultValue={0} />)}
                  </FormItem>
                  <FormItem label="Disc Invoice(N)" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('discNominal', {
                      initialValue: 0,
                      rules: [{
                        required: false,
                        message: 'Required',
                      }],
                    })(<InputNumber defaultValue={0} step={500} min={0} onChange={_value => hdlChangeNominal(_value)} />)}
                  </FormItem>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={14}>
                  <FormItem label="Invoice Date" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('transDate', {
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<DatePicker onChange={_value => hdlDateChange(_value)} />)}
                  </FormItem>
                  <FormItem label="Tempo" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('tempo', {
                      intialValue: tempo,
                      rules: [{
                        required: true,
                        message: 'Required',
                        pattern: /^\d+$/gi,
                      }],
                    })(<Input maxLength={5} onChange={_value => onChange(_value)} />)}
                  </FormItem>
                  <FormItem label="Due Date" hasFeedback {...formItemLayout}>
                    <Input disabled value={date} />
                  </FormItem>
                  <FormItem label="Payment Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('invoiceType', {
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })((<Select>
                      <Option value="C">CASH</Option>
                      <Option value="K">KREDIT</Option>
                    </Select>))}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={14}>
          <Collapse stylebordered={false} bordered={false} defaultActiveKey={['1']}>
            <Panel header="Search Supplier" key="1" style={customPanelStyle}>
              <FormItem label="Search" {...formItemLayout}>
                <div style={{ marginLeft: 20, clear: 'both', whiteSpace: 'nowrap' }}>
                  <Popover placement="bottomLeft" content={contentPopover} trigger={'focus'}>
                    <Search onEnter={value => hdlSearch(value)} onSearch={value => hdlSearch(value)} onFocus={() => hdlGetSupplier()} />
                  </Popover>
                </div>
              </FormItem>
              <FormItem label="id" hasfeedback {...formItemLayout}>
                <Input disabled value={supplierInformation ? supplierInformation.id : null} />
              </FormItem>
              <FormItem label="Supplier Name" hasfeedback {...formItemLayout}>
                <Input disabled value={supplierInformation ? supplierInformation.supplierName : null} />
              </FormItem>
              <FormItem label="Address" hasfeedback {...formItemLayout}>
                <TextArea value={supplierInformation ? supplierInformation.address01 : null} autosize={{ minRows: 2, maxRows: 6 }} disabled />
              </FormItem>
            </Panel>
          </Collapse>
        </Col>
      </Row>
      <Row style={{ padding: 1 }}>
        <Col span={24}>
          <ButtonGroup size="large">
            <Button type="primary" onClick={() => hdlBrowseProduct()}>Product</Button>
            <Button type="primary"><Icon type="plus-square-o" /></Button>
          </ButtonGroup>
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
              initialValue: 0,
              rules: [{
                required: true,
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

PurchaseForm.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onGetSupplier: PropTypes.func,
  dataBrowse: PropTypes.array,
}

export default Form.create()(PurchaseForm)
