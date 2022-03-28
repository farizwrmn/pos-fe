import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Select, Button, Input, DatePicker, Row, Col, Modal } from 'antd'
import { getVATPercentage } from 'utils/tax'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { lg: 14, md: 14, sm: 14, float: 'left' },
  wrapperCol: { lg: 14, md: 14, sm: 14 }
}

const Company = ({
  formHeader,
  visibilitySave,
  config,
  onOk,
  changeVisible,
  form: { getFieldDecorator, validateFields, getFieldsValue }
}) => {
  Object.compare = function (obj1, obj2) {
    // Loop through properties in object 1
    for (let p in obj1) {
      // Check property exists on both objects
      if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false

      switch (typeof (obj1[p])) {
        // Deep compare objects
        case 'object':
          if (!Object.compare(obj1[p], obj2[p])) return false
          break
        // Compare function code
        case 'function':
          if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false
          break
        // Compare values
        default:
          if (obj1[p] !== obj2[p]) return false
      }
    }

    // Check object 2 for any extra properties
    for (let p in obj2) {
      if (typeof (obj1[p]) === 'undefined') return false
    }
    return true
  }
  const saveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      let dataInventory = {
        ...data
      }
      if (Object.compare(dataInventory, config)) {
        changeVisible('visible', 'Inventory')
        Modal.warning({
          title: 'No Changes',
          content: 'No Changes Detected'
        })
      } else {
        onOk(formHeader, dataInventory)
        changeVisible('visible', 'Inventory')
      }
    })
  }
  return (
    <Form layout="horizontal" className="ant-form-item-label-float-left">
      <Row style={{ margin: '5px 10px 5px 10px' }}>
        <Col lg={{ span: 9, offset: 1 }} md={{ span: 9, offset: 1 }} sm={{ span: 19 }}>
          <FormItem label="Company Name" {...formItemLayout}>
            {getFieldDecorator('companyName', {
              initialValue: config.companyName,
              rules: [
                {
                  pattern: /^[a-z0-9-.,_/ ]{5,65}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Company Address" {...formItemLayout}>
            {getFieldDecorator('companyAddress', {
              initialValue: config.companyAddress,
              rules: [
                {
                  pattern: /^[A-Za-z0-9-._/ ]{5,100}$/i,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Contact" {...formItemLayout}>
            {getFieldDecorator('contact', {
              initialValue: config.contact,
              rules: [
                {
                  pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                  message: 'mobile number is not valid'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Email" {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: config.email,
              rules: [
                {
                  pattern: /^([a-zA-Z0-9._-a-zA-Z0-9])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: 'The input is not valid E-mail!'
                }
              ]
            })(<Input />)}
          </FormItem>
        </Col>
        <Col lg={{ span: 9, offset: 1 }} md={{ span: 9, offset: 1 }} sm={{ span: 19 }}>
          <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxType', {
              initialValue: config.taxType,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select>
              {/* onBlur={hdlChangePercent} */}
              <Option value="I">Include</Option>
              <Option value="E">Exclude (0%)</Option>
              <Option value="S">Exclude ({getVATPercentage()}%)</Option>
            </Select>)}
          </FormItem>
          <FormItem label="TAX ID" {...formItemLayout}>
            {getFieldDecorator('taxID', {
              initialValue: config.taxID,
              rules: [
                {
                  required: false,
                  pattern: /^[0-9-._/ ]{5,20}$/i,
                  message: 'The input is not valid TaxId!'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Taxable enterprise confirmation" {...formItemLayout}>
            {getFieldDecorator('taxConfirmDate', {
              initialValue: config.taxConfirmDate ? moment.utc(config.taxConfirmDate, 'YYYY-MM-DD') : null
            })(<DatePicker />)}
          </FormItem>
        </Col>
      </Row>
      {visibilitySave && <Button type="primary" htmlType="submit" className="ant-form-save-width-half" onClick={saveClick} style={{ visibility: visibilitySave, margin: '5px 5px 5px 5px' }}>
        Save
      </Button>}
    </Form>
  )
}

Company.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  changeVisible: PropTypes.func,
  loading: PropTypes.object
}

export default Form.create()(Company)
