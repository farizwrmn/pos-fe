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
}
const PurchaseForm = ({onOk, onChooseSupplier, onChangeDatePicker, onChangePPN, handleBrowseProduct, modalProductVisible, modalPurchaseVisible, supplierInformation, listSupplier, onGetSupplier, onChooseItem, onSearchSupplier, date, tempo, datePicker,onChangeDate, form: {getFieldDecorator, getFieldsValue, validateFields}, ...purchaseProps}) => {
  const confirmPurchase = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log('onOk data:', data)
      onOk(data)
    })
  }
  const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
  }
  console.log('tempo', tempo)
  const hdlDateChange = (e) => {
    var a = e.format('YYYY/MM/DD')
    localStorage.setItem('setDate', a)
    var b = localStorage.getItem('setDate')
    onChangeDate(b)
  }

  const onChange = (e) => {
    const {value} = e.target
    var a = localStorage.getItem('setDate')
    console.log('onChange', a)
    var add = moment(a,'YYYY/MM/DD').add(value, 'd')
    onChangeDate(add.format('YYYY/MM/DD'))
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
  const a = localStorage.getItem('setDate') ? moment(localStorage.getItem('setDate')).format('YYYY/MM/DD') : moment().format('YYYY/MM/DD')
  console.log('date:', a)

  return (
    <Form style={{padding: 3}}>
      <Row>
        <Col xs={24} sm={24} md={10} lg={12} xl={14}>
          <Collapse stylebordered={false} defaultActiveKey={['1', '2']}>
            <Panel header="Invoice Information" key="1" style={customPanelStyle}>
              <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={14}>
                  <FormItem label="Invoice No" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('transNo', {
                      initialValue: 'MBM-0000031',
                      rules: [{
                        required: true,
                        message: 'Required',
                        pattern: /^[a-z0-9/-]{6,25}$/i,
                      }],
                    })(<Input maxLength={25}/>)}
                  </FormItem>
                  <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('taxType', {
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
                      initialValue: 31,
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<InputNumber size="large" min={0} max={100} step={0.1} defaultValue={0}/>)}
                  </FormItem>
                  <FormItem label="Disc Invoice(N)" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('discNominal', {
                      initialValue: 10000,
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={14}>
                  <FormItem label="Invoice Date" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('transDate', {
                      initialValue: moment.utc(a, 'YYYY/MM/DD'),
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<DatePicker onChange={(value) => hdlDateChange(value)}/>)}
                  </FormItem>
                  <FormItem label="Tempo" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('tempo', {
                      value: tempo,
                      validateFirst: true,
                      rules: [{
                        required: true,
                        message: 'Required',
                        pattern: /^\d+$/gi,
                      }],
                    })(<Input maxLength={5} onChange={(value) => onChange(value)}/>)}
                  </FormItem>
                  <FormItem label="Due Date" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('dueDate', {
                      initialValue: date,
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<Input disabled/>)}
                  </FormItem>
                  <FormItem label="Payment Type" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('invoiceType', {
                      initialValue: 'C',
                      rules: [{
                        required: true,
                        message: 'Required',
                      }],
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={14}>
          <Collapse stylebordered={false} defaultActiveKey={['1']}>
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
                {getFieldDecorator('supplierCode', {
                  initialValue: supplierInformation ? supplierInformation.id : null,
                  rules: [{
                    required: true,
                    message: 'Required',
                  }],
                })(<Input disabled/>)}
              </FormItem>
              <FormItem label="Supplier Name" hasfeedback {...formItemLayout}>
                {getFieldDecorator('supplierName', {
                  initialValue: supplierInformation ? supplierInformation.supplierName : null,
                  rules: [{
                    required: false,
                    message: 'Required',
                  }],
                })(<Input disabled value={date}/>)}
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
        </Col>
      </Row>
      <Browse {...purchaseProps}/>
      {modalPurchaseVisible && <PurchaseList {...purchaseProps} />}
      <Button type="primary" size="large" onClick={confirmPurchase}>Confirm</Button>
    </Form>
  )
}

PurchaseForm.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onGetSupplier: PropTypes.func,
}

export default Form.create()(PurchaseForm)
