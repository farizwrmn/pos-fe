import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button, InputNumber, Input, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

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
  modalVisible,
  currentItem,
  supplierBank,
  listSettlementAccumulated,
  listReconNotMatch,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields,
    validateFields
  },
  onSubmit,
  ...tableProps
}) => {
  console.log('listReconNotMatch', listReconNotMatch)
  const childrenLov = listReconNotMatch && listReconNotMatch.length > 0 ? listReconNotMatch.map(recon => <Option value={recon.id} key={recon.id}>{`id:${recon.id} batchNumber:${recon.edcBatchNumber} amount:${recon.grossAmount} MDR:${recon.mdr}`}</Option>) : []
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
      visible={modalVisible}
      width="800px"
      height="50%"
      title="Form Settlement Accumulated"
      footer={[]}
      //   <Button key="submit" onClick={() => handleOk()} type="primary" >Ok</Button>
      // ]}
      {...tableProps}
    >
      <Form>
        <FormItem label="id" hasFeedback {...formMandatoryField}>
          {getFieldDecorator('id', {
            initialValue: currentItem.id
          })(<Input disabled value={currentItem.id} />)}
        </FormItem>
        <FormItem label="Mdr Amount" hasFeedback {...formMandatoryField}>
          {getFieldDecorator('mdrAmount', {
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
        <FormItem label="Rekening" hasFeedback {...formMandatoryField}>
          {getFieldDecorator('csvId', {
            rules: [{ required: true }]
          })(<Select
            optionFilterProp="children"
            mode="default"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >{childrenLov}
          </Select>)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            size="large"
            style={{ marginLeft: '5px' }}
            onClick={() => handleOk()}
            loading={loading.effects['importBcaRecon/updateList']}
            disabled={loading.effects['importBcaRecon/updateList'] || loading.effects['importBcaRecon/closeModalInputMdrAmount']}
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
