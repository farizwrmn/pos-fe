import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button, Select, Input, message } from 'antd'
import moment from 'moment'
import { formatTimeBCA } from '../utils'

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

const FormInputMdrAmount = ({
  loading,
  onCancel,
  dispatch,
  className,
  modalVisible,
  currentItem,
  supplierBank,
  listBank,
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
  const childrenLov = listReconNotMatch && listReconNotMatch.length > 0 ?
    listReconNotMatch.map(recon => <Option value={recon.id} key={recon.id}>{`${recon.grossAmount ? recon.grossAmount.toLocaleString() : 'Undefined Amount'} (Date: ${recon.transactionDate} ${formatTimeBCA(recon.transactionTime)})`}</Option>) : []

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      let data = {
        ...getFieldsValue(),
        id: currentItem.id
      }
      const filteredMdrAmount = listReconNotMatch.filter(filtered => Number(filtered.id) === Number(data.csvId))
      let grossAmount = 0
      if (filteredMdrAmount && filteredMdrAmount[0]) {
        data.mdrAmount = filteredMdrAmount[0].mdrAmount
        grossAmount = filteredMdrAmount[0].grossAmount
      }
      console.log('currentItem', currentItem, listReconNotMatch)
      const amountDiff = currentItem.amount - grossAmount
      if (amountDiff > 2000 || amountDiff < -2000) {
        message.error('Different between amount more than 2000')
        return
      }
      onSubmit(data, resetFields)
    })
  }

  return (
    <Modal
      className={className}
      visible={modalVisible}
      width="800px"
      height="50%"
      title="Matching MDR Amount"
      footer={null}
      onCancel={onCancel}
      {...tableProps}
    >
      <Form>
        <FormItem label="Trans Date" hasFeedback {...formMandatoryField}>
          {getFieldDecorator('transDates', {
            initialValue: `${moment(currentItem.transDate).format('YYYY-MM-DD HH:mm')}`
          })(<Input disabled min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Data dari Bank" hasFeedback {...formMandatoryField}>
          {getFieldDecorator('csvId', {
            rules: [{ required: true }]
          })(<Select
            showSearch
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
            disabled={loading.effects['importBcaRecon/updateList'] || loading.effects['importBcaRecon/closeModal']}
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    </Modal>
  )
}

FormInputMdrAmount.propTypes = {
  form: PropTypes.object.isRequired,
  supplierBank: PropTypes.object.isRequired
}

export default Form.create()(FormInputMdrAmount)
