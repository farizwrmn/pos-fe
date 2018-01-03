import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Row, Col } from 'antd'
import List from './List'
import Filter from './Filter'
import InputSearch from './InputSearch'

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
  disabled,
  resetItem,
  activeKey,
  button,
  ...tabProps,
  ...listProps,
  ...filterProps,
  ...inputSearchProps,
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

  return (
    <Tabs activeKey={activeKey} {...tabProps} onTabClick={handleReset} onChange={key => change(key)}>
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
