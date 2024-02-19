import React, { Component } from 'react'
import { Form, Input, Button, Radio, Row, Col, Modal } from 'antd'
import { showOnlyLastWord } from 'utils/string'

const FormItem = Form.Item

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

class FormCustomer extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('memberCode')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      modalType,
      loading,
      button,
      memberCodeDisable,
      setting,
      item,
      onSubmit,
      confirmSendMember,
      cancelMember,
      onCancel,
      form: {
        getFieldsValue,
        getFieldDecorator,
        resetFields,
        validateFields
      }
    } = this.props

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...item,
          ...getFieldsValue(),
          memberName: 'Member K3Mart',
          memberGroupId: 2,
          memberTypeId: 2
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
            if (modalType === 'add' || modalType === 'edit') {
              if (data && data.memberCode) {
                data.mobileNumber = data.memberCode
                data.phoneNumber = data.memberCode
                if (data.memberCode.length > 6) {
                  data.memberName = showOnlyLastWord(data.memberCode, 4)
                }
              }
              onSubmit(data.memberCode, data, modalType)
            } else {
              data.mobileNumber = data.memberCode
              data.phoneNumber = data.memberCode
              if (data.memberCode.length > 6) {
                data.memberName = showOnlyLastWord(data.memberCode, 4)
              }
              confirmSendMember(data.memberCode, data, modalType)
            }
            resetFields()
          },
          onCancel () { }
        })
      })
    }

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
        <FormItem label="Phone Number" hasFeedback {...formItemLayout}>
          <Row style={{ padding: '0px' }}>
            <Col xs={24} sm={20} md={6} lg={6}>
              <Input
                value="+62"
                disabled
              />
            </Col>
            <Col xs={24} sm={20} md={18} lg={18}>
              {getFieldDecorator('memberCode', {
                initialValue: item.memberCode,
                rules: [
                  {
                    required: setting.memberCode ? !setting.memberCode : !memberCodeDisable,
                    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                    message: 'a-Z & 0-9'
                  }
                ]
              })(
                <Input
                  placeholder={setting.memberCode || memberCodeDisable ? 'Code generate by system' : ''}
                  disabled={item.memberCode && modalType === 'edit' ? item.memberCode : (setting.memberCode || memberCodeDisable)}
                  style={{ height: '32px' }}
                  maxLength={14}
                />
              )}
            </Col>
          </Row>
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
              <Radio value="1">Male</Radio>
              <Radio value="0">Female</Radio>
            </Radio.Group>
          )}
        </FormItem>
        {(modalType === 'edit' || modalType === 'add') &&
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" disabled={loading && loading.effects && loading.effects['customer/add']} onClick={handleSubmit}>{button}</Button>
          </FormItem>}
        {modalType === 'addMember' && <div style={{ textAlign: 'right' }}>
          <Button type="danger" style={{ margin: '0 10px' }} onClick={cancelMember}>Cancel</Button>
          <Button type="primary" disabled={loading && loading.effects && loading.effects['customer/add']} onClick={handleSubmit}>Save</Button>
        </div>}
      </Form>
    )
  }
}

export default Form.create()(FormCustomer)
