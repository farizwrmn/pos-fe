import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Checkbox, Modal, Button } from 'antd'
import { posTotal } from 'utils'
import { getDistPriceName } from 'utils/string'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 }
}

const modal = ({
  item,
  onOkList,
  onCancelList,
  onDeleteItem,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...formEditProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.no = item.no
      data.id = item.id
      data.type = item.type
      data.categoryCode = item.categoryCode
      data.productId = item.productId
      data.productCode = item.productCode
      data.productName = item.productName
      data.sellingPrice = data.sellPrice
      data.sellPrice = data.sellPrice
      data.discount = 0
      data.disc1 = 0
      data.disc2 = 0
      data.disc3 = 0
      data.total = posTotal(data)
      onOkList(data)
    })
  }
  const handleCancel = () => {
    onCancelList()
  }
  const handleDelete = () => {
    Modal.confirm({
      title: `Delete ${item.productName}`,
      content: 'Are you sure ?',
      onOk () {
        onDeleteItem(item.no - 1)
        resetFields()
      }
    })
  }
  const modalOpts = {
    ...formEditProps,
    onOk: handleOk
  }

  return (
    <Modal title={`Reward for ${item.productCode} - ${item.productName}`}
      {...modalOpts}
      footer={[
        <Button size="large" key="delete" type="danger" onClick={handleDelete}>Delete</Button>,
        <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
        <Button size="large" key="submit" type="primary" onClick={handleOk}>
          Ok
        </Button>
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Qty" hasFeedback {...formItemLayout}>
          {getFieldDecorator('qty', {
            initialValue: item.qty,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('sellPrice')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('sellPrice', {
            initialValue: item.sellPrice,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice01')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice01', {
            initialValue: item.distPrice01,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice02')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice02', {
            initialValue: item.distPrice02,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice03')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice03', {
            initialValue: item.distPrice03,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice04')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice04', {
            initialValue: item.distPrice04,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label={getDistPriceName('distPrice05')} hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice05', {
            initialValue: item.distPrice05,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Can Be Replace" {...formItemLayout}>
          {getFieldDecorator('replaceable', {
            valuePropName: 'checked',
            initialValue: item.replaceable === undefined
              ? false
              : item.replaceable
          })(<Checkbox>Can Be Replace</Checkbox>)}
        </FormItem>
        <FormItem label="Hide" {...formItemLayout}>
          {getFieldDecorator('hide', {
            valuePropName: 'checked',
            initialValue: item.hide === undefined
              ? true
              : item.hide
          })(<Checkbox>Hide</Checkbox>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(modal)
