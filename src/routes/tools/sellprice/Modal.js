import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  currentItemList,
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
      data.no = currentItemList.no
      data.transType = currentItemList.transType
      data.productId = currentItemList.productId
      data.productCode = currentItemList.productCode
      data.productName = currentItemList.productName
      data.prevSellPrice = currentItemList.prevSellPrice
      data.prevDistPrice01 = currentItemList.prevDistPrice01
      data.prevDistPrice02 = currentItemList.prevDistPrice02
      onOkList(data)
    })
  }
  const handleCancel = () => {
    onCancelList()
  }
  const handleDelete = () => {
    Modal.confirm({
      title: `Delete ${currentItemList.productName}`,
      content: 'Are you sure ?',
      onOk () {
        onDeleteItem(currentItemList.no - 1)
        resetFields()
      }
    })
  }
  const modalOpts = {
    ...formEditProps,
    onOk: handleOk
  }
  return (
    <Modal title={`${currentItemList.productCode} - ${currentItemList.productName}`}
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
        <FormItem label="Sell Price" hasFeedback {...formItemLayout}>
          {getFieldDecorator('sellPrice', {
            initialValue: currentItemList.sellPrice,
            rules: [{
              required: true
            }]
          })(<InputNumber autoFocus min={0} style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
      <Form layout="horizontal">
        <FormItem label="Dist Price 01" hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice01', {
            initialValue: currentItemList.distPrice01,
            rules: [{
              required: true
            }]
          })(<InputNumber min={0} style={{ width: '100%' }} />)}
        </FormItem>
      </Form>
      <Form layout="horizontal">
        <FormItem label="Dist Price 02" hasFeedback {...formItemLayout}>
          {getFieldDecorator('distPrice02', {
            initialValue: currentItemList.distPrice02,
            rules: [{
              required: true
            }]
          })(<InputNumber min={0} style={{ width: '100%' }} />)}
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
