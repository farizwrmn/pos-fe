import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Select, Row, Col } from 'antd'
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

const formService = ({
  item = {},
  onSubmit,
  disabled,
  resetItem,
  activeKey,
  button,
  changeTab,
  listServiceType,
  ...listProps,
  ...filterProps,
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
      onSubmit(data.serviceCode, data)
      handleReset()
    })
  }

  const serviceType = listServiceType.length > 0 ? listServiceType.map(service => <Option value={service.miscName} key={service.miscName}>{service.miscName}</Option>) : []

  return (
    <Tabs activeKey={activeKey} onTabClick={handleReset} onChange={key => change(key)}>
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...col}>
              <FormItem label="Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('serviceCode', {
                  initialValue: item.serviceCode,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9_]+$/,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input disabled={disabled} maxLength={30} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Service" hasFeedback {...formItemLayout}>
                {getFieldDecorator('serviceName', {
                  initialValue: item.serviceName,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9 _-]+$/,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={50} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Cost" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cost', {
                  initialValue: item.cost,
                  rules: [
                    {
                      required: true,
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Service Cost" hasFeedback {...formItemLayout}>
                {getFieldDecorator('serviceCost', {
                  initialValue: item.serviceCost,
                  rules: [
                    {
                      pattern: /^(?:0|[1-9][0-9]{0,})$/,
                      message: '0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Service Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('serviceTypeId', {
                  initialValue: item.serviceTypeId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  mode="default"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{serviceType}
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

formService.propTypes = {
  form: PropTypes.object.isRequired,
  listServiceType: PropTypes.object,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  resetItem: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string,
}

export default Form.create()(formService)
