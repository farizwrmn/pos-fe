import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Select, DatePicker, Radio, Row, Col, Icon, Dropdown, Menu } from 'antd'
import moment from 'moment'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const ButtonGroup = Button.Group

const formItemLayout = {
  labelCol: {
    xs: { span: 13, },
    sm: { span: 8, },
    md: { span: 7, },
  },
  wrapperCol: {
    xs: { span: 11, },
    sm: { span: 14, },
    md: { span: 14, },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: { offset: 17, },
    sm: { offset: 19, },
    md: { offset: 18, },
    lg: { offset: 17, },
  },
}

const col = {
  lg: {
    span: 12,
    offset: 0,
  },
}

const formCustomer = ({
  item = {},
  onSubmit,
  disabled,
  clickBrowse,
  activeKey,
  listGroup,
  listType,
  listCity,
  listIdType,
  showCustomerGroup,
  showCustomerType,
  showIdType,
  showCity,
  button,
  changeTab,
  ...listProps,
  ...filterProps,
  ...printProps,
  ...tabProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
  const { show } = filterProps
  const { onShowHideSearch } = tabProps
  const handleReset = () => {
    resetFields()
  }

  const change = (key) => {
    changeTab(key)
    handleReset()
  }

  const customerGroup = () => {
    showCustomerGroup()
  }

  const customerType = () => {
    showCustomerType()
  }

  const idType = () => {
    showIdType()
  }

  const cities = () => {
    showCity()
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
        ...getFieldsValue(),
      }
      onSubmit(data.memberCode, data)
      handleReset()
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

  const childrenGroup = listGroup.length > 0 ? listGroup.map(group => <Option value={group.id} key={group.id}>{group.groupName}</Option>) : []
  const childrenType = listType.length > 0 ? listType.map(type => <Option value={type.id} key={type.id}>{type.typeName}</Option>) : []
  const childrenLov = listIdType.length > 0 ? listIdType.map(lov => <Option value={lov.key} key={lov.key}>{lov.title}</Option>) : []
  const childrenCity = listCity.length > 0 ? listCity.map(city => <Option value={city.id} key={city.id}>{city.cityName}</Option>) : []

  const tabOperations = <div>
    <ButtonGroup size="small">
      <Button type="primary">
        <Icon type="printer" /> Print
      </Button>
      <Button >
        <Icon type="search" /> Search
      </Button>
    </ButtonGroup>
  </div>

  return (
    <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab}>
      <TabPane tab="Form" key="0" >
        <Form layout="horizontal">
          <Row>
            <Col {...col}>
              <FormItem label="Member Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('memberCode', {
                  initialValue: item.memberCode,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-z0-9\_-]{3,15}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input disabled={disabled} maxLength={15} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Member Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('memberName', {
                  initialValue: item.memberName,
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-z0-9\_.,\- ]{3,50}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={50} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Member Group Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('memberGroupId', {
                  initialValue: item.memberGroupId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  onFocus={customerGroup}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{childrenGroup}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Member Type Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('memberTypeId', {
                  initialValue: item.memberTypeId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  mode="default"
                  onFocus={customerType}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{childrenType}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="ID Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('idType', {
                  initialValue: item.idType,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select
                  optionFilterProp="children"
                  mode="default"
                  onFocus={idType}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{childrenLov}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="ID No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('idNo', {
                  initialValue: item.idNo,
                  rules: [
                    {
                      required: true,
                      pattern: /^[A-Za-z0-9-_. ]{3,30}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={30} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Address 01" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address01', {
                  initialValue: item.address01,
                  rules: [
                    {
                      required: true,
                      pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={50} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Address 02" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address02', {
                  initialValue: item.address02,
                  rules: [
                    {
                      pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={50} />)}
              </FormItem>
            </Col>
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
                  mode="default"
                  onFocus={cities}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{childrenCity}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="State" hasFeedback {...formItemLayout}>
                {getFieldDecorator('state', {
                  initialValue: item.state,
                  rules: [
                    {
                      pattern: /^[a-z0-9\_\-]{3,20}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Zip Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('zipCode', {
                  initialValue: item.zipCode,
                  rules: [
                    {
                      pattern: /^[a-z0-9\_\-]{3,20}$/i,
                      message: 'a-Z & 0-9',
                    },
                  ],
                })(<Input maxLength={20} />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Phone Number" hasFeedback {...formItemLayout}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: item.phoneNumber,
                })(<Input />)}
              </FormItem>
            </Col>
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
            <Col {...col}>
              <FormItem label="Email" hasFeedback {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: item.email,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Birth Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('birthDate', {
                  initialValue: moment(item.birthDate),
                })(<DatePicker />)}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem label="Tax ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxId', {
                  initialValue: item.taxId,
                  rules: [
                    {
                      pattern: /^[0-9]+$/,
                      message: '0-9',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...col}>
              <FormItem label="Gender" hasFeedback {...formItemLayout}>
                {getFieldDecorator('gender', {
                  initialValue: item.gender,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Radio.Group value={item.gender}>
                    <Radio value="M">Male</Radio>
                    <Radio value="F">Female</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col {...col}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </Col>
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

formCustomer.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  listGroup: PropTypes.object,
  listType: PropTypes.object,
  listCity: PropTypes.object,
  listIdType: PropTypes.object,
  onSubmit: PropTypes.func,
  clickBrowse: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string,
  showCustomerGroup: PropTypes.func,
  showCustomerType: PropTypes.func,
  showIdType: PropTypes.func,
  showCity: PropTypes.func,
}

export default Form.create()(formCustomer)
