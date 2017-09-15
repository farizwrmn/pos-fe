import React from 'react'
import PropTypes from 'prop-types'
import {DatePicker, Form, Input, Select, InputNumber, Collapse, Popover, Table, Col, Row, Button, Icon} from 'antd'
import moment from 'moment'
import Browse from './Browse'
import ModalBrowse from './ModalBrowse'
import PurchaseList from './PurchaseList'

const {TextArea, Search} = Input
const Panel = Collapse.Panel
const FormItem = Form.Item
const Option = Select.Option
const ButtonGroup = Button.Group

const formItemLayout = {
  labelCol: {span: 11},
  wrapperCol: {span: 12},
  style: {marginBottom: 5},
}
const formItemLayout1 = {
  labelCol: {span: 10},
  wrapperCol: {span: 11},
}
const PurchaseForm = ({onDiscPercent, dataBrowse, onResetBrowse, onDiscNominal, onOk, curDiscNominal, curDiscPercent, onChooseSupplier, onChangeDatePicker, onChangePPN, handleBrowseProduct,
                        modalProductVisible, modalPurchaseVisible, supplierInformation, listSupplier, onGetSupplier,
                         onChooseItem, onSearchSupplier, date, tempo, datePicker,onChangeDate, form: {getFieldDecorator, getFieldsValue, validateFields, resetFields}, ...purchaseProps}) => {
  let dataPurchase = (localStorage.getItem('product_detail') === null ? [] : JSON.parse(localStorage.getItem('product_detail')))
  let g = dataPurchase
  let grandTotal = g.reduce( function(cnt,o){ return cnt + o.total; }, 0)
  let realTotal = g.reduce( function(cnt,o){ return cnt + (o.qty * o.price); }, 0)
  let totalPpn = g.reduce( function(cnt,o){ return cnt + o.ppn; }, 0)
  let totalDpp = g.reduce( function(cnt,o){ return cnt + o.dpp; }, 0)
  let totalQty = g.reduce( function(cnt,o){ return cnt + parseInt(o.qty); }, 0)
  let discPercent = ((curDiscPercent * grandTotal) / 100)
  let discNominal = curDiscNominal * totalQty
  let totalDisc = discNominal + discPercent
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
      console.log('onOk data:', data)
      onOk(data)
      resetFields()
    })
  }
  const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
  }
  const hdlDateChange = (e) => {
    var a = e.format('YYYY-MM-DD')
    localStorage.setItem('setDate', a)
    var b = localStorage.getItem('setDate')
    onChangeDate(b)
  }

  const hdlChangePercent = (e) => {
    onDiscPercent(e)
  }

  const hdlChangeNominal = (e) => {
    onDiscNominal(e)
  }

  const onChange = (e) => {
    const {value} = e.target
    var a = localStorage.getItem('setDate')
    var add = moment(a,'YYYY-MM-DD').add(value, 'd')
    onChangeDate(add.format('YYYY-MM-DD'))
  }
  const hdlSearch = (e) => {
    onSearchSupplier(e, listSupplier)
  }

  const hdlGetSupplier = () => {
    onGetSupplier()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: '10%'
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
    },
  ]
  const handleMenuClick = (record) => {
    onChooseSupplier(record)
  }
  const hdlBrowseProduct = () => {
    handleBrowseProduct()
  }
  const contentPopover = (
    <Table
      bordered
      pagination={false}
      scroll={{x: 500, y: 100}}
      columns={columns}
      simple
      dataSource={listSupplier}
      size="small"
      pageSize={5}
      rowKey={record => record.productCode}
      onRowClick={(record) => handleMenuClick(record)}
    />
  )
  const hdlPPN = (e) => {
    onChangePPN(e)
  }
  const resetProduct = () => {
    localStorage.removeItem('product_detail')
    onResetBrowse()
  }
  const a = localStorage.getItem('setDate') ? moment(localStorage.getItem('setDate')).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')

  return (
    <Form style={{padding: 3}}>
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
                    })(<Input maxLength={25}/>)}
                  </FormItem>
                  <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('taxType', {
                      initialValue: 'E',
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
                    })(<InputNumber onChange={(value) => hdlChangePercent(value)} size="large" min={0} max={100} step={0.1} defaultValue={0}/>)}
                  </FormItem>
                  <FormItem label="Disc Invoice(N)" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('discNominal', {
                      initialValue: 0,
                      rules: [{
                        required: false,
                        message: 'Required',
                      }],
                    })(<InputNumber defaultValue={0} step={500} min={0} onChange={(value) => hdlChangeNominal(value)}/>)}
                  </FormItem>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={14}>
                  <FormItem label="Invoice Date" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('transDate', {
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<DatePicker onChange={(value) => hdlDateChange(value)}/>)}
                  </FormItem>
                  <FormItem label="Tempo" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('tempo', {
                      intialValue: tempo,
                      rules: [{
                        required: true,
                        message: 'Required',
                        pattern: /^\d+$/gi,
                      }],
                    })(<Input maxLength={5} onChange={(value) => onChange(value)}/>)}
                  </FormItem>
                  <FormItem label="Due Date" hasFeedback {...formItemLayout}>
                    <Input disabled value={date}/>
                  </FormItem>
                  <FormItem label="Payment Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('invoiceType', {
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })((<Select onChange={(value) => hdlPPN(value)}>
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
                <div style={{marginLeft: 20, clear: 'both', whiteSpace: 'nowrap'}}>
                  <Popover placement="bottomLeft" content={contentPopover} trigger={"focus"}>
                    <Search onEnter={value => hdlSearch(value)} onSearch={value => hdlSearch(value)}
                            onFocus={() => hdlGetSupplier()}/>
                  </Popover>
                </div>
              </FormItem>
              <FormItem label="id" hasfeedback {...formItemLayout}>
                <Input disabled value={supplierInformation ? supplierInformation.id : null}/>
              </FormItem>
              <FormItem label="Supplier Name" hasfeedback {...formItemLayout}>
                <Input disabled value={supplierInformation ? supplierInformation.supplierName : null}/>
              </FormItem>
              <FormItem label="Address" hasfeedback {...formItemLayout}>
            <TextArea value={supplierInformation ? supplierInformation.address01 : null}
                      autosize={{minRows: 2, maxRows: 6}} disabled/>
              </FormItem>
            </Panel>
          </Collapse>
        </Col>
      </Row>
      <Row style={{padding: 1}}>
        <Col span={24}>
          <ButtonGroup size="large">
            <Button type="primary" onClick={() => hdlBrowseProduct()}>Product</Button>
            <Button type="primary"><Icon type="plus-square-o"/></Button>
          </ButtonGroup>
          {modalProductVisible && <ModalBrowse {...purchaseProps} />}
          <Button style={{marginLeft: 150}} type="danger" size="large" onClick={resetProduct}>Reset</Button>
        </Col>
      </Row>
      <Browse {...purchaseProps}/>
      {modalPurchaseVisible && <PurchaseList {...purchaseProps} />}
      <Row>
        <Col span="12">
          <Button type="primary" size="large" onClick={confirmPurchase} style={{ marginBottom: 2, marginTop: 10 }}>Confirm</Button>
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
        </Col>
      </Row>
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
