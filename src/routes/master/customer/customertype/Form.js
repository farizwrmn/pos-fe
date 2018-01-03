import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Select, InputNumber, Row, Col } from 'antd'
import List from './List'
import Filter from './Filter'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

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
  disabled,
  resetItem,
  activeKey,
  button,
  listSellprice,
  ...tabProps,
  ...listProps,
  ...filterProps,
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
      console.log('Submit')
      onSubmit(data)
      handleReset()
    })
  }

  const children = listSellprice.length > 0 ? listSellprice.map(misc => <Option value={misc.miscName} key={misc.miscName}>{misc.miscName}</Option>) : []

  return (
    <Tabs activeKey={activeKey} {...tabProps} onTabClick={handleReset} onChange={key => change(key)}>
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...col}>
              <FormItem label="Type Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('typeCode', {
                  initialValue: item.typeCode,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-z0-9\_]{1,5}$/i,
                      message: 'a-z & 0-9',
                    },
                  ],
                })(<Input disabled={disabled} maxLength={5} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Type Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('typeName', {
                  initialValue: item.typeName,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Discount 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discPct01', {
                  initialValue: item.discPct01,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Discount 2" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discPct02', {
                  initialValue: item.discPct02,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Discount 3" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discPct03', {
                  initialValue: item.discPct03,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Discount Nominal" hasFeedback {...formItemLayout}>
                {getFieldDecorator('discNominal', {
                  initialValue: item.discNominal,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
                {getFieldDecorator('sellPrice', {
                  initialValue: item.sellPrice,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  mode="default"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{children}
                </Select>)}
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
        <Filter {...filterProps} />
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
  showSellPrice: PropTypes.func,
  resetItem: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string,
  listSellprice: PropTypes.object,
}

export default Form.create()(formCustomerType)
