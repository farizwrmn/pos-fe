import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Tabs, Row, Col, Dropdown, Menu, Icon, Collapse } from 'antd'
import List from './List'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'
import BrowseButtom from './BrowseButton'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Panel = Collapse.Panel

const formItemLayout = {
  labelCol: {
    xs: {
      span: 13,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 11,
    },
    sm: {
      span: 14,
    },
    md: {
      span: 14,
    },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 17,
    },
    sm: {
      offset: 19,
    },
    md: {
      offset: 18,
    },
    lg: {
      offset: 17,
    },
  },
}

const col = {
  lg: {
    span: 12,
    offset: 0,
  },
}

const formCustomerType = ({
  item = {},
  onSubmit,
  listItem,
  disabled,
  clickBrowse,
  activeKey,
  dataCustomer,
  button,
  ...tabProps,
  ...listProps,
  ...printProps,
  ...modalProps,
  changeTab,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
  const handleReset = () => {
    resetFields()
  }

  const change = (key) => {
    changeTab(key)
    handleReset()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        memberCode: getFieldsValue().memberCode,
        policeNo: getFieldsValue().policeNo,
        merk: getFieldsValue().merk,
        model: getFieldsValue().model,
        type: getFieldsValue().type,
        year: getFieldsValue().year,
        chassisNo: getFieldsValue().chassisNo,
        machineNo: getFieldsValue().machineNo,
      }
      console.log('Submit')
      onSubmit(data)
      handleReset()
    })
  }

  const browse = () => {
    clickBrowse()
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )
  const info = (
    <div>
      <FormItem label="Member Code" {...formItemLayout} >
        {getFieldDecorator('memberCode', {
          initialValue: dataCustomer.memberCode,
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Name" {...formItemLayout}>
        {getFieldDecorator('memberName', {
          initialValue: dataCustomer.memberName,
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="BirthDate" {...formItemLayout}>
        {getFieldDecorator('birthDate', {
          initialValue: moment(dataCustomer.birthDate).format('MMMM Do YYYY'),
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="City" {...formItemLayout}>
        {getFieldDecorator('cityName', {
          initialValue: dataCustomer.cityName,
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Address" {...formItemLayout}>
        {getFieldDecorator('address01', {
          initialValue: dataCustomer.address01,
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Type" {...formItemLayout}>
        {getFieldDecorator('memberTypeName', {
          initialValue: dataCustomer.memberTypeName,
        })(<Input disabled />)}
      </FormItem>
    </div>
  )

  const collapseActiveKey = '1'
  const collapseTitle = `Customer Info(${dataCustomer.memberCode})`

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (listItem.length > 0 ? (<Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown>) : '')

  return (
    <Tabs activeKey={activeKey} {...tabProps} onChange={key => change(key)} tabBarExtraContent={moreButtonTab}>
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...col}>
              <FormItem label="Member Code" hasFeedback {...formItemLayout}><BrowseButtom {...modalProps} />
              </FormItem>
              <FormItem label="Police No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('policeNo', {
                  initialValue: item.policeNo,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-z0-9\_\-]{3,50}$/i,
                      message: 'a-z & 0-9',
                    },
                  ],
                })(<Input disabled={disabled} />)}
              </FormItem>
              <FormItem label="Merk" hasFeedback {...formItemLayout}>
                {getFieldDecorator('merk', {
                  initialValue: item.merk,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="Model" hasFeedback {...formItemLayout}>
                {getFieldDecorator('model', {
                  initialValue: item.model,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="Tipe" hasFeedback {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="Tahun" hasFeedback {...formItemLayout}>
                {getFieldDecorator('year', {
                  initialValue: item.year,
                  rules: [
                    {
                      required: true,
                      pattern: /^[12][0-9]{3}$/,
                      message: 'year is not valid',
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="No Rangka" hasFeedback {...formItemLayout}>
                {getFieldDecorator('chassisNo', {
                  initialValue: item.chassisNo,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="No Mesin" hasFeedback {...formItemLayout}>
                {getFieldDecorator('machineNo', {
                  initialValue: item.machineNo,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </Col>
            <Col {...col}>
              <Collapse defaultActiveKey={collapseActiveKey} style={{ display: Object.keys(dataCustomer).length > 0 ? 'block' : 'none' }}>
                <Panel header={collapseTitle} key="1">
                  {info}
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane tab="Browse" key="1" >
        <BrowseButtom {...modalProps} />
        <List {...listProps} />
      </TabPane>
    </Tabs>
  )
}

formCustomerType.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  listItem: PropTypes.object,
  dataCustomer: PropTypes.object,
  onSubmit: PropTypes.func,
  clickBrowse: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  modalVisible: PropTypes.bool,
  button: PropTypes.string,
}

export default Form.create()(formCustomerType)
