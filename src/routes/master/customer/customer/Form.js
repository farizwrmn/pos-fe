import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, DatePicker, Radio, Row, Col, Tooltip } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
// const ButtonGroup = Button.Group

const formItemLayout = {
  labelCol: {
    xs: { span: 13 },
    sm: { span: 8 },
    md: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 11 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formCustomer = ({
  modalType,
  item,
  listGroup,
  listType,
  listIdType,
  listCity,
  button,
  showCustomerGroup,
  showCustomerType,
  showIdType,
  showCity,
  onCancel,
  onCancelMobile,
  onSubmit,
  disabled,
  showMobileModal,
  defaultMember,
  updateCurrentItem,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 16 : 20
      },
      md: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 16 : 20
      },
      lg: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 14 : 19
      }
    }
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

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleCancelMobile = () => {
    onCancelMobile()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...item,
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data.memberCode, data)
          setTimeout(() => {
            resetFields()
          }, 500)
        },
        onCancel () { }
      })
    })
  }
  const childrenGroup = listGroup.length > 0 ? listGroup.map(group => <Option value={group.id} key={group.id}>{group.groupName}</Option>) : []
  const childrenType = listType.length > 0 ? listType.map(type => <Option value={type.id} key={type.id}>{type.typeName}</Option>) : []
  const childrenLov = listIdType.length > 0 ? listIdType.map(lov => <Option value={lov.key} key={lov.key}>{lov.title}</Option>) : []
  const childrenCity = listCity.length > 0 ? listCity.map(city => <Option value={city.id} key={city.id}>{city.cityName}</Option>) : []

  const OpenMobileModal = () => {
    showMobileModal(getFieldsValue())
    resetFields()
  }
  const GetDefaultMember = () => {
    if (!item.memberGetDefault) {
      const { memberCode, ...other } = getFieldsValue()
      defaultMember(other)
      resetFields()
    } else {
      updateCurrentItem(getFieldsValue())
      resetFields()
    }
  }

  const disabledDate = (current) => {
    return current > moment(new Date())
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <FormItem label="Member Group Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('memberGroupId', {
                initialValue: item.memberGroupId,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                autoFocus
                placeholder="Select Member Group Name"
                optionFilterProp="children"
                onFocus={customerGroup}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >{childrenGroup}
              </Select>)}
            </FormItem>
            <FormItem label="Member Type Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('memberTypeId', {
                initialValue: item.memberTypeId,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                placeholder="Select Member Type Name"
                optionFilterProp="children"
                mode="default"
                onFocus={customerType}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >{childrenType}
              </Select>)}
            </FormItem>

            <FormItem label="Member Code" hasFeedback {...formItemLayout}>
              <Row style={{ padding: '0px' }}>
                <Col lg={18} md={24}>
                  {getFieldDecorator('memberCode', {
                    initialValue: item.memberCode,
                    rules: [
                      {
                        required: item.memberGetDefault ? !item.memberGetDefault : true,
                        pattern: /^[a-z0-9_-]{3,16}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input placeholder={item.memberGetDefault ? 'Code generate by system' : ''} disabled={item.memberCodeDisable ? item.memberCodeDisable : disabled} style={{ height: '32px' }} maxLength={16} />)}
                </Col>
                <Col lg={6} md={24}>
                  <Tooltip placement="bottomLeft" title="Get member from mobile user">
                    <Button disabled={modalType === 'edit'} style={{ height: '32px' }} type="primary" icon="mobile" onClick={OpenMobileModal} />
                  </Tooltip>
                  <Tooltip placement="bottomLeft" title="Get Default Code">
                    <Button disabled={modalType === 'edit'} style={{ height: '32px' }} type="dashed" icon="check" onClick={GetDefaultMember} />
                  </Tooltip>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Member Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('memberName', {
                initialValue: item.memberName,
                rules: [
                  {
                    required: true,
                    pattern: /^[a-z0-9_. ,-]{3,50}$/i,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input disabled={item.memberNameDisable || false} maxLength={50} />)}
            </FormItem>
            <FormItem label="ID Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('idType', {
                initialValue: item.idType,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                optionFilterProp="children"
                mode="default"
                onFocus={idType}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >{childrenLov}
              </Select>)}
            </FormItem>
            <FormItem label="ID No" hasFeedback {...formItemLayout}>
              {getFieldDecorator('idNo', {
                initialValue: item.idNo,
                rules: [
                  {
                    required: true,
                    pattern: /^[A-Za-z0-9-_. ]{3,30}$/i,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input maxLength={30} />)}
            </FormItem>
            <FormItem label="Address 01" hasFeedback {...formItemLayout}>
              {getFieldDecorator('address01', {
                initialValue: item.address01,
                rules: [
                  {
                    required: true,
                    pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input maxLength={50} />)}
            </FormItem>
            <FormItem label="Address 02" hasFeedback {...formItemLayout}>
              {getFieldDecorator('address02', {
                initialValue: item.address02,
                rules: [
                  {
                    pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input maxLength={50} />)}
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
                mode="default"
                onFocus={cities}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >{childrenCity}
              </Select>)}
            </FormItem>
          </Col>
          <Col {...column} >
            <FormItem label="State" hasFeedback {...formItemLayout}>
              {getFieldDecorator('state', {
                initialValue: item.state,
                rules: [
                  {
                    pattern: /^[a-z0-9_-]{3,20}$/i,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(<Input maxLength={20} />)}
            </FormItem>
            <FormItem label="Zip Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('zipCode', {
                initialValue: item.zipCode,
                rules: [
                  {
                    pattern: /^[0-9]{5}$/i,
                    message: '0-9'
                  }
                ]
              })(<Input maxLength={5} />)}
            </FormItem>
            <FormItem label="Phone Number" hasFeedback {...formItemLayout}>
              {getFieldDecorator('phoneNumber', {
                initialValue: item.phoneNumber,
                rules: [
                  {
                    required: true,
                    pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                    message: 'Input a Phone No.[xxxx xxxx xxxx]'
                  }
                ]
              })(<Input />)}
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
            <FormItem label="Email" hasFeedback {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: item.email,
                rules: [
                  {
                    required: false,
                    pattern: /^([a-zA-Z0-9._-a-zA-Z0-9])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    message: 'The input is not valid E-mail!'
                  }
                ]
              })(<Input disabled={item.emailDisable || false} />)}
            </FormItem>
            <FormItem label="Birth Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('birthDate', {
                initialValue: item.birthDate ? moment(item.birthDate) : null
              })(<DatePicker disabledDate={disabledDate} />)}
            </FormItem>
            <FormItem label="Tax ID" hasFeedback {...formItemLayout}>
              {getFieldDecorator('taxId', {
                initialValue: item.taxId,
                rules: [
                  {
                    pattern: /^[0-9]{3,15}$/,
                    message: '0-9'
                  }
                ]
              })(<Input maxLength={15} />)}
            </FormItem>
            <FormItem label="Gender" hasFeedback {...formItemLayout}>
              {getFieldDecorator('gender', {
                initialValue: item.gender,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Radio.Group value={item.gender}>
                  <Radio value="M">Male</Radio>
                  <Radio value="F">Female</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
              {item.memberCodeDisable && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancelMobile}>Cancel</Button>}
              <Button type="primary" onClick={handleSubmit}>{button}</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

formCustomer.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  listGroup: PropTypes.object.isRequired,
  listType: PropTypes.object.isRequired,
  listCity: PropTypes.object.isRequired,
  listIdType: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  clickBrowse: PropTypes.func.isRequired,
  activeKey: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  showCustomerGroup: PropTypes.func.isRequired,
  showCustomerType: PropTypes.func.isRequired,
  showIdType: PropTypes.func.isRequired,
  showCity: PropTypes.func
}

export default Form.create()(formCustomer)
