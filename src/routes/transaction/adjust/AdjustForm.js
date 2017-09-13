import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Popover, Button, Table, Icon, Row, Col, DatePicker, Cascader, AutoComplete } from 'antd'
import moment from 'moment'
import Browse from './Browse'

const dateFormat = 'YYYY/MM/DD'
const FormItem = Form.Item
const { TextArea } = Input;
const { Search } = Input

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 9 }, md: { span: 9 }, lg: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 10 }, md: { span: 10 }, lg: { span: 10 } },
  style: { marginBottom: 3 },
}
const formItemLayout1 = {
  labelCol: { xs: { span: 24 }, sm: { span: 9 }, md: { span: 9 }, lg: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 14 }, lg: { span: 15 } },
  style: { marginBottom: 3 },
}
const AdjustForm = ({onChooseItem, onGetEmployee, itemEmployee, listType, listEmployee, onSearchProduct, onGetProduct, item,
                      popoverVisible, onHidePopover, onOk, onChangeSearch, dataSource, form: {getFieldDecorator, getFieldsValue, validateFields}, ...adjustProps}) => {
  const handleButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        pic: itemEmployee !== null ? itemEmployee.employeeName : '',
        picId: itemEmployee !== null ? itemEmployee.employeeId : '',
      }
      data.transType = data.transType[0]
      console.log('onOk data:', data)
      onOk(data)
    })
  }

  const hdlGetProduct = () => {
    onGetProduct()
  }

  const handleGetEmployee = (e) => {
    onGetEmployee(e)
  }

  const hdlSearch = (e) => {
    onSearchProduct(e, dataSource)
  }

  const hidePopover = () => {
    onHidePopover()
  }

  const handleChangeSearch = (e) => {
    const { value } = e.target
    onChangeSearch(value)
  }

  const handleMenuClick = (item) => {
    onChooseItem(item)
  }
  const columns = [
    {
      title: 'code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '25%',
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: '55%',
    },
    {
      title: 'Cost',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: '20%',
    },
  ]
  const contentPopover = (
    <Table
      pagination={{ total: dataSource.length, pageSize: 5 }}
      scroll={{ x: 600, y: 150 }}
      columns={columns}
      simple
      dataSource={dataSource}
      locale={{
        emptyText: <Button type='primary' onClick={() => hdlGetProduct()}>Reset</Button>,
      }}
      size="small"
      rowKey={record => record.productCode}
      onRowClick={(record) => handleMenuClick(record)}
    />
  )
  return (
    <Form style={{ padding: 3 }}>
      <Row>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="Trans No" {...formItemLayout}>
            {getFieldDecorator('transNo', {
              rules: [{
                required: true,
              }],
            })(<Input maxLength={25} />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="Type" {...formItemLayout}>
            {getFieldDecorator('transType', {
              rules: [{
                required: true,
              }],
            })(
              <Cascader
                size="large"
                style={{ width: '100%' }}
                options={listType}
                placeholder="Pick a Type"

              />
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="Date" {...formItemLayout}>
            {getFieldDecorator('transDate', {
              rules: [{
                required: true,
              }],
            })(<DatePicker format={dateFormat} />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="Reference" {...formItemLayout1}>
            {getFieldDecorator('reference', {
              rules: [{
                required: true,
              }],
            })(<Input maxLength={40} />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="Memo" {...formItemLayout1}>
            {getFieldDecorator('memo', {
              rules: [{
                required: false,
              }],
            })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 4 }} />)}
          </FormItem>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="Employee" {...formItemLayout}>
            {getFieldDecorator('employeeName', {
              rules: [{
                required: true,
              }],
            })(
              <AutoComplete
                style={{ width: 200 }}
                dataSource={listEmployee}
                onChange={(value) => handleGetEmployee(value)}
                placeholder="Select Employee"
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}

              />
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="PIC" {...formItemLayout}>
            <Input value={itemEmployee !== null ? itemEmployee.employeeName : ''} />
          </FormItem>
        </Col>
        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <FormItem label="PIC ID" {...formItemLayout}>
            <Input value={itemEmployee !== null ? itemEmployee.employeeId : ''} />
          </FormItem>
        </Col>
      </Row>
      <div style={{ marginTop: 30 }}>
        <Popover visible={popoverVisible} title={<a onClick={() => hidePopover()}><Icon type="close" /> Close</a>} placement="bottomLeft" content={contentPopover} trigger={'focus'}>
          <Search prefix={<Icon type="barcode" />}
                  autoFocus
                  size="large"
                  placeholder="Search Product By Code or Name"
                  onEnter={value => hdlSearch(value)}
                  onSearch={value => hdlSearch(value)}
                  onChange={(value) => handleChangeSearch(value)}
                  onFocus={() => hdlGetProduct()}
                  onClick={() => hdlGetProduct()} />
        </Popover>
      </div>
      <div>
        <Browse {...adjustProps} />
      </div>
      <Button type="primary" style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonSaveClick()}>PROCESS</Button>
    </Form>
  )
}

AdjustForm.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  item: PropTypes.object,
  onGetEmployee: PropTypes.func,
  dispatch: PropTypes.func,
}

export default Form.create()(AdjustForm)
