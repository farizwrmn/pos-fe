import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Col, Button, Modal, Select } from 'antd'
import List from './List'
import Setting from './Setting'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 5 },
    md: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 10 },
    md: { span: 15 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormInput = ({
  ...otherProps,
  item,
  addShift,
  deleteShift,
  addCounter,
  deleteCounter,
  memberCodeBySystem,
  cashRegisterPeriods,
  listStore,
  setting,
  listCity,
  listShift,
  listCounter,
  showParents,
  modalType,
  onSubmit,
  onEditItem,
  onCancel,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  let listProps = {
    ...otherProps,
    editItem () {
      onEditItem()
      resetFields()
    }
  }

  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 18
      },
      sm: {
        offset: modalType === 'edit' ? 2 : 13
      },
      md: {
        offset: modalType === 'edit' ? 9 : 17
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const changeCashRegisterPeriods = (e) => {
    const check = e.target.checked
    const value = e.target.value
    cashRegisterPeriods(check, value)
  }

  const changeShift = (e) => {
    const check = e.target.checked
    if (check) {
      addShift(e.target.value)
    } else {
      deleteShift(e.target.value)
    }
  }

  const changeCounter = (e) => {
    const check = e.target.checked
    if (check) {
      addCounter(e.target.value)
    } else {
      deleteCounter(e.target.value)
    }
  }

  const changeMemberCode = (e) => {
    const check = e.target.checked
    memberCodeBySystem(check)
  }

  let cities = []
  let parents = []
  if (listCity && listCity.length > 0) {
    cities = listCity.map(x => (<Option value={x.id}>{x.cityName}</Option>))
  }
  if (listStore && listStore.length > 0) {
    parents = listStore.map(x => (<Option value={x.id}>{x.title}</Option>))
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.settingValue = {
        cashRegisterPeriods: {
          active: setting.cashRegisterPeriods.active,
          autoClose: setting.cashRegisterPeriods.autoClose
        },
        shift: setting.selectedShift,
        counter: setting.selectedCounter,
        memberCode: {
          bySystem: setting.memberCode
        }
      }

      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(item.id, { ...data })
          setTimeout(() => {
            resetFields()
          }, 500)
        },
        onCancel () { }
      })
    })
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const settingProps = {
    listShift,
    listCounter,
    setting,
    changeCashRegisterPeriods,
    changeShift,
    changeCounter,
    changeMemberCode
  }

  return (
    <Row>
      <Col {...column}>
        <Form layout="horizontal">
          <Row>
            <Col span={24}>
              <FormItem label="Store Code" hasFeedback {...formItemLayout}>
                {getFieldDecorator('code', {
                  initialValue: item.storeCode,
                  rules: [{ required: true }]
                })(<Input maxLength={20} />)}
              </FormItem>
              <FormItem label="Store Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.storeName,
                  rules: [{ required: true }]
                })(<Input maxLength={50} />)}
              </FormItem>
              <FormItem label="Store Parent" hasFeedback {...formItemLayout}>
                {getFieldDecorator('parent', {
                  initialValue: item.storeParentId
                })(<Select
                  allowClear
                  optionFilterProp="children"
                  onFocus={showParents}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{parents}
                </Select>)}
              </FormItem>
              <FormItem label="Short Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('shortName', {
                  initialValue: item.shortName,
                  rules: [{ required: true }]
                })(<Input maxLength={20} />)}
              </FormItem>
              <FormItem label="Address 01" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address01', {
                  initialValue: item.address01,
                  rules: [{ required: true }]
                })(<Input maxLength={100} />)}
              </FormItem>
              <FormItem label="Address 02" hasFeedback {...formItemLayout}>
                {getFieldDecorator('address02', {
                  initialValue: item.address02
                })(<Input maxLength={100} />)}
              </FormItem>
              <FormItem label="City" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cityId', {
                  initialValue: item.cityId,
                  rules: [{ required: true }]
                })(<Select
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >{cities}
                </Select>)}
              </FormItem>
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
                      pattern: /^([a-zA-Z0-9._-a-zA-Z0-9])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                      message: 'The input is not valid E-mail!'
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem label="Tax ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('taxID', {
                  initialValue: item.taxId,
                  rules: [
                    {
                      pattern: /^[0-9]{3,15}$/,
                      message: '0-9'
                    }
                  ]
                })(<Input maxLength={15} />)}
              </FormItem>
              <FormItem label="Latitude" hasFeedback {...formItemLayout}>
                {getFieldDecorator('latitude', {
                  initialValue: item.latitude
                })(<Input maxLength={20} />)}
              </FormItem>
              <FormItem label="Longitude" hasFeedback {...formItemLayout}>
                {getFieldDecorator('longitude', {
                  initialValue: item.longitude
                })(<Input maxLength={20} />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col {...column}>
        <List {...listProps} />
        <div style={{ height: 10 }} />
        <Setting {...settingProps} />
      </Col>
    </Row>
  )
}

FormInput.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object
}

export default Form.create()(FormInput)
