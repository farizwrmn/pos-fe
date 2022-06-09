import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Select, Button } from 'antd'
import { getVATPercentage, getCountryTaxPercentage } from 'utils/tax'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalTax = ({
  onOk,
  invoiceCancel,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        transNo: invoiceCancel
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }
  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>
      ]}
    >
      <Form>
        <FormItem label="Tax Type" {...formItemLayout}>
          {getFieldDecorator('taxType', {
            rules: [{
              required: false,
              message: 'Required'
            }]
          })(<Select allowClear style={{ width: '60%' }} placeholder="Tax Type">
            <Option value="E">Exclude (0%)</Option>
            <Option value="I">Include ({getVATPercentage()}%)</Option>
            <Option value="O">Include ({getCountryTaxPercentage()}%)</Option>
          </Select>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

ModalTax.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalTax)
