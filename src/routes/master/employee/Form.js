import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Select, Row, Col, Dropdown, Icon, Menu, Modal, message } from 'antd'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: {
      span: 13
    },
    sm: {
      span: 8
    },
    md: {
      span: 7
    }
  },
  wrapperCol: {
    xs: {
      span: 11
    },
    sm: {
      span: 14
    },
    md: {
      span: 14
    }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 17
    },
    sm: {
      offset: 19
    },
    md: {
      offset: 18
    },
    lg: {
      offset: 17
    }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formEmployee = ({
  item,
  sequence,
  onSubmit,
  disabled,
  activeKey,
  button,
  changeTab,
  clickBrowse,
  showPosition,
  showCities,
  listLovJobPosition,
  listCity,
  ...listProps,
  ...filterProps,
  ...printProps,
  ...tabProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const { show } = filterProps
  const { onShowHideSearch } = tabProps
  const handleReset = () => {
    resetFields()
  }

  const change = (key) => {
    handleReset()
    changeTab(key)
  }

  const jobPosition = () => {
    showPosition()
  }

  const city = () => {
    showCities()
  }

  const browse = () => {
    clickBrowse()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data.employeeId) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.employeeId, data)
          },
          onCancel () {}
        })
      } else {
        message.warning("Employee Id can't be null")
      }
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{ `${show ? 'Hide' : 'Show'} Search` }</Button> <Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  const jobposition = listLovJobPosition.length > 0 ? listLovJobPosition.map(position => <Option value={position.value} key={position.value}>{position.label}</Option>) : []
  const cities = listCity.length > 0 ? listCity.map(c => <Option value={c.id} key={c.id}>{c.cityName}</Option>) : []

  return (
    <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...column}>
              <FormItem label="Employee ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeId', {
                  initialValue: sequence,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-zA-Z0-9_]{6,15}$/i,
                      message: 'a-z & 0-9, min: 6 characters'
                    }
                  ]
                })(<Input disabled={disabled} maxLength={15} />)}
              </FormItem>
              <FormItem label="Employee Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeName', {
                  initialValue: item.employeeName,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem label="Position" hasFeedback {...formItemLayout}>
                {getFieldDecorator('positionId', {
                  initialValue: item.positionId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => jobPosition()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{jobposition}
                </Select>)}
              </FormItem>
              <FormItem label="Address 1" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address01', {
                  initialValue: item.address01,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem label="Address 2" {...formItemLayout}>
                {getFieldDecorator('address02', {
                  initialValue: item.address02
                })(<Input />)}
              </FormItem>
              <FormItem label="City" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cityId', {
                  initialValue: item.cityId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select
                  optionFilterProp="children"
                  onFocus={() => city()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{cities}
                </Select>)}
              </FormItem>
              <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobileNumber', {
                  initialValue: item.mobileNumber,
                  rules: [
                    {
                      required: true,
                      pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                      message: 'mobile number is not valid'
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem label="Phone Number" {...formItemLayout}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: item.phoneNumber
                })(<Input />)}
              </FormItem>
              <FormItem label="Email" {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: item.email
                })(<Input />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane tab="Browse" key="1">
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
  clickBrowse: PropTypes.func,
  showPosition: PropTypes.func,
  disabled: PropTypes.bool,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formEmployee)
