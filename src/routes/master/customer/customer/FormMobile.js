import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Collapse } from 'antd'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const Panel = Collapse.Panel

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

const ModalMobile = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  },
  onActivate,
  dataCustomer,
  openModal,
  modalVisible,
  ...modalMobileProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      if (!dataCustomer.id) return
      const params = {
        id: dataCustomer.id,
        memberCardId: data.memberCardId
      }
      onActivate(params)
      resetFields()
    })
  }

  const mobileOpts = {
    onOk: handleOk,
    ...modalMobileProps
  }

  const info = (
    <div>
      <FormItem label="Member Code" {...formItemLayout} >
        {getFieldDecorator('memberCode', {
          initialValue: dataCustomer.memberCode
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Name" {...formItemLayout}>
        {getFieldDecorator('memberName', {
          initialValue: dataCustomer.memberName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="BirthDate" {...formItemLayout}>
        {getFieldDecorator('birthDate', {
          initialValue: dataCustomer.birthDate ? moment(dataCustomer.birthDate).format('MMMM Do YYYY') : ''
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="City" {...formItemLayout}>
        {getFieldDecorator('cityName', {
          initialValue: dataCustomer.cityName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Address" {...formItemLayout}>
        {getFieldDecorator('address01', {
          initialValue: dataCustomer.address01
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Type" {...formItemLayout}>
        {getFieldDecorator('memberTypeName', {
          initialValue: dataCustomer.memberTypeName
        })(<Input disabled />)}
      </FormItem>
    </div>
  )

  return (
    <div>
      {modalVisible && <ModalBrowse {...modalMobileProps} />}
      <Form layout="horizontal" {...mobileOpts}>
        <FormItem label="MEMBER CODE" hasFeedback {...formItemLayout}>
          <Button type="primary" size="large" onClick={openModal} style={{ marginBottom: 15 }}>Find Customer</Button>
        </FormItem>
        <FormItem label="MOBILE ID" hasFeedback {...formItemLayout}>
          {getFieldDecorator('memberCardId', {
            rules: [
              {
                required: true
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={handleOk}>Activate</Button>
        </FormItem>
        <Collapse defaultActiveKey="1" >
          <Panel header="Member Info" key="1">
            {info}
          </Panel>
        </Collapse>
      </Form>
    </div>
  )
}

ModalMobile.propTypes = {
  form: PropTypes.object.isRequired
}

export default Form.create()(ModalMobile)
