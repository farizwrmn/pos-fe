import React from 'react'
import moment from 'moment'
import InputMask from 'react-input-mask'
import { Form, Input, Button, Select, DatePicker, Radio, Row, Col, Tooltip, Modal } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 6 },
    md: { span: 11 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 11 },
    md: { span: 13 },
    lg: { span: 14 }
  }
}

const column = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 }
}

const FormCustomer = ({
  modalType,
  button,
  memberCodeDisable,
  setting,
  item,
  onSubmit,
  confirmSendMember,
  cancelMember,
  listGroup,
  listType,
  listCity,
  listIdType,
  showCustomerGroup,
  showCustomerType,
  showIdType,
  showCity,
  defaultMember,
  onCancel,
  form: {
    getFieldValue,
    getFieldsValue,
    getFieldDecorator,
    resetFields,
    validateFields
  }
}) => {
  const disabledDate = (current) => {
    return current > moment(new Date())
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
      if (data.email === '') data.email = null
      if (data.taxId === '') data.taxId = null
      if (data.taxId) {
        if (data.taxId.includes('_')) {
          Modal.warning({
            title: 'NPWP is not valid!'
          })
          return
        }
        data.taxId = data.taxId.replace(/[.-]/g, '')
      }
      data.memberGetDefault = setting.memberCode
      if (memberCodeDisable) data.memberGetDefault = memberCodeDisable
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          console.log('modalType', modalType)

          if (modalType === 'add' || modalType === 'edit') {
            onSubmit(data.memberCode, data, modalType)
          } else {
            confirmSendMember(data.memberCode, data, modalType)
          }
          resetFields()
        },
        onCancel () { }
      })
    })
  }

  const GetDefaultMember = () => {
    defaultMember()
    resetFields()
  }

  const childrenGroup = listGroup.length > 0 ? listGroup.map(group => <Option value={group.id} key={group.id}>{group.groupName}</Option>) : []
  const childrenType = listType.length > 0 ? listType.map(type => <Option value={type.id} key={type.id}>{type.typeName}</Option>) : []
  const childrenLov = listIdType.length > 0 ? listIdType.map(lov => <Option value={lov.key} key={lov.key}>{lov.title}</Option>) : []
  const childrenCity = listCity.length > 0 ? listCity.map(city => <Option value={city.id} key={city.id}>{city.cityName}</Option>) : []
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 11 : 15
      },
      md: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 18 : 20
      },
      lg: {
        offset: modalType === 'edit' || item.memberCodeDisable ? 18 : 21
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  return (
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
              onFocus={showCustomerGroup}
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
              onFocus={showCustomerType}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{childrenType}
            </Select>)}
          </FormItem>
          <FormItem label="Member Code" hasFeedback {...formItemLayout}>
            <Row style={{ padding: '0px' }}>
              <Col xs={24} sm={20} md={18} lg={18}>
                {getFieldDecorator('memberCode', {
                  initialValue: item.memberCode,
                  rules: [
                    {
                      required: setting.memberCode ? !setting.memberCode : !memberCodeDisable,
                      pattern: /^[a-z0-9_-]{3,16}$/i,
                      message: 'a-Z & 0-9'
                    }
                  ]
                })(
                  <Input
                    placeholder={setting.memberCode || memberCodeDisable ? 'Code generate by system' : ''}
                    disabled={item.memberCode && modalType === 'edit' ? item.memberCode : (setting.memberCode || memberCodeDisable)}
                    style={{ height: '32px' }}
                    maxLength={16}
                  />
                )}
              </Col>
              <Col xs={24} sm={4} md={6} lg={6}>
                <Tooltip placement="bottomLeft" title="Get Default Code">
                  <Button disabled={item.memberCode ? item.memberCode : setting.memberCode} style={{ height: '32px' }} type="dashed" icon="check" onClick={GetDefaultMember} />
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
                  required: !!getFieldValue('idNo')
                }
              ]
            })(<Select
              optionFilterProp="children"
              mode="default"
              onFocus={showIdType}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{childrenLov}
            </Select>)}
          </FormItem>
          <FormItem label="ID No" hasFeedback {...formItemLayout}>
            {getFieldDecorator('idNo', {
              initialValue: item.idNo,
              rules: [
                {
                  required: false,
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
                  required: false,
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
                  required: false
                }
              ]
            })(<Select
              optionFilterProp="children"
              mode="default"
              onFocus={showCity}
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
                  required: false,
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
                  required: false,
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
              initialValue: item.taxId
            })(<InputMask mask="99.999.999.9-999.999" className="ant-input ant-input-lg" />)}
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
        </Col>
      </Row>
      {(modalType === 'edit' || modalType === 'add') &&
        <FormItem {...tailFormItemLayout}>
          {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
          <Button type="primary" onClick={handleSubmit}>{button}</Button>
        </FormItem>}
      {modalType === 'addMember' && <div style={{ textAlign: 'right' }}>
        <Button type="danger" style={{ margin: '0 10px' }} onClick={cancelMember}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>Save</Button>
      </div>}
    </Form>
  )
}

export default Form.create()(FormCustomer)
