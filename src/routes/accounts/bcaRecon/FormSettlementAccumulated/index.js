import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button, InputNumber, Input } from 'antd'

const FormItem = Form.Item

const formMandatoryField = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
    md: { span: 9 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 14 }
  }
}

const FormSettlementAccumulated = ({
  loading,
  dispatch,
  className,
  modalSettlementVisible,
  currentItemSettlement,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields,
    validateFields
  },
  onSubmit,
  ...tableProps
}) => {
  const reset = () => {
    resetFields(['mdrAmount', 'id', 'csvId'])
  }

  const handleOk = () => {
    const data = {
      ...getFieldsValue()
    }

    validateFields((errors) => {
      if (errors) {
        return
      }

      onSubmit(data)
      reset()
    })
  }

  return (
    <Modal
      className={className}
      visible={modalSettlementVisible}
      width="800px"
      height="50%"
      title="Form Settlement Accumulated"
      footer={[]}
      {...tableProps}
    >
      <Form>
        <FormItem label="id" hasFeedback {...formMandatoryField}>
          {getFieldDecorator('id', {
            initialValue: currentItemSettlement.id
          })(<Input disabled value={currentItemSettlement.id} />)}
        </FormItem>
        <FormItem label="Amount" hasFeedback {...formMandatoryField}>
          {getFieldDecorator('amount', {
            normalize: (value) => {
              if (value || value === 0) {
                if (value.toString().match(/\d+,($|\d+)/)) {
                  return value.toString().replace(',', '.')
                }
                return value
              }
            },
            rules: [
              {
                required: true,
                message: 'The value must not be empty'
              },
              {
                pattern: /^[0-9]+(\.[0-9]{0,7})?$/,
                message: 'The value must be a number with a maximum of 7 decimal places'
              }
            ]
          })(<InputNumber min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            size="large"
            style={{ marginLeft: '5px' }}
            onClick={() => handleOk()}
            loading={loading.effects['importBcaRecon/updateList']}
            disabled={loading.effects['importBcaRecon/updateList'] || loading.effects['importBcaRecon/closeModal']}
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    </Modal>
  )
}

FormSettlementAccumulated.propTypes = {
  form: PropTypes.object.isRequired,
  supplierBank: PropTypes.object.isRequired
}

export default Form.create()(FormSettlementAccumulated)
