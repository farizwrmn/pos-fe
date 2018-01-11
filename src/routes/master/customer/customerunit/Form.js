import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Row, Col, Dropdown, Menu, Icon } from 'antd'
import List from './List'
import Filter from './Filter'
import InputSearch from './InputSearch'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

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
  resetItem,
  activeKey,
  button,
  ...tabProps,
  ...listProps,
  ...filterProps,
  ...inputSearchProps,
  ...printProps,
  changeTab,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
  const handleReset = () => {
    resetItem()
    resetFields()
  }

  const change = (key) => {
    changeTab(key)
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.memberCode = data.memberCode.title
      console.log('Submit', data)
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
              <FormItem label="Member Code" hasFeedback {...formItemLayout}><InputSearch {...inputSearchProps} />
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
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
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Merk" hasFeedback {...formItemLayout}>
                {getFieldDecorator('merk', {
                  initialValue: item.merk,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Model" hasFeedback {...formItemLayout}>
                {getFieldDecorator('model', {
                  initialValue: item.model,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Tipe" hasFeedback {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: item.type,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Tahun" hasFeedback {...formItemLayout}>
                {getFieldDecorator('year', {
                  initialValue: item.year,
                  rules: [
                    {
                      required: false,
                      pattern: /^[12][0-9]{3}$/,
                      message: 'year is not valid',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="No Rangka" hasFeedback {...formItemLayout}>
                {getFieldDecorator('chassisNo', {
                  initialValue: item.chassisNo,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="No Mesin" hasFeedback {...formItemLayout}>
                {getFieldDecorator('machineNo', {
                  initialValue: item.machineNo,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
        </Form>
      </TabPane>
      <TabPane tab="Browse" key="1" >
        {/* <Filter {...filterProps} /> */}
        <List {...listProps} />
      </TabPane>
    </Tabs>
  )
}

formCustomerType.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  resetItem: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string,
}

export default Form.create()(formCustomerType)
