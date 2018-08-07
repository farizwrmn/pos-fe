import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 }
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
      data.type = item.type
      data.productId = item.productId
      data.productCode = item.productCode
      data.productName = item.productName
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
    <Modal title={`Rules for ${item.productCode} - ${item.productName}`}
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
          })(<InputNumber autoFocus min={0} max={99999} style={{ width: '100%' }} />)}
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
