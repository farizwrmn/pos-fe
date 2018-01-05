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

const formEmployee = ({
  item,
  onSubmit,
  disabled,
  resetItem,
  activeKey,
  button,
  changeTab,
  showPosition,
  showCities,
  listLovJobPosition,
  listCity,
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

  const jobPosition = () => {
    showPosition()
  }

  const city = () => {
    showCities()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onSubmit(item.employeeId, data)
      handleReset()
    })
  }

  const jobposition = listLovJobPosition.length > 0 ? listLovJobPosition.map(position => <Option value={position.value} key={position.value}>{position.label}</Option>) : []
  const cities = listCity.length > 0 ? listCity.map(c => <Option value={c.id} key={c.id}>{c.cityName}</Option>) : []

  return (
    <Tabs activeKey={activeKey} onTabClick={handleReset} onChange={key => change(key)}>
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...col}>
              <FormItem label="Employee ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeId', {
                  initialValue: item.employeeId,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9\_]{6,15}$/i,
                      message: 'a-z & 0-9, min: 6 characters',
                    },
                  ],
                })(<Input disabled maxLength={15} />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Employee Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeName', {
                  initialValue: item.employeeName,
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
              <FormItem label="Position" hasFeedback {...formItemLayout}>
                {getFieldDecorator('positionId', {
                  initialValue: item.positionId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => jobPosition()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{jobposition}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Address 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address01', {
                  initialValue: item.address01,
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
              <FormItem label="Address 2" {...formItemLayout}>
                {getFieldDecorator('address02', {
                  initialValue: item.address02,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="City" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cityId', {
                  initialValue: item.cityId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => city()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{cities}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobileNumber', {
                  initialValue: item.mobileNumber,
                  rules: [
                    {
                      required: true,
                      pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                      message: 'mobile number is not valid',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Phone Number" {...formItemLayout}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: item.phoneNumber,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...col} />
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Email" {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: item.email,
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
        <Filter {...filterProps} />
        <List {...listProps} />
      </TabPane>
    </Tabs>
  )
}

formEmployee.propTypes = {
  form: PropTypes.object.isRequired,
  listLovJobPosition: PropTypes.object,
  listCity: PropTypes.object,
  showCities: PropTypes.func,
  showPosition: PropTypes.func,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  resetItem: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string,
}

export default Form.create()(formEmployee)
