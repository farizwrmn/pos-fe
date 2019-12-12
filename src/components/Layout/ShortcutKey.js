import React from 'react'
import { Modal, Form, Card, Input } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
}

const ModalHelp = ({ ...modalProps }) => {
  const modalOpts = {
    ...modalProps,
    wrapClassName: 'vertical-center-modal'
  }

  return (
    <Modal {...modalOpts} width="768" footer={[]}>
      <Card bordered={false} title="Shortcut Information" >
        <Form layout="horizontal">
          <FormItem label="Product/Service" {...formItemLayout}>
            <Input value="F2" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Refund" {...formItemLayout}>
            <Input value="F4" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Closing Cashier" {...formItemLayout}>
            <Input value="Ctrl + Shift + L" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Insert Queue" {...formItemLayout}>
            <Input value="Ctrl + Shift + U" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Void/Delete Item" {...formItemLayout}>
            <Input value="F7" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Void/Delete All Item" {...formItemLayout}>
            <Input value="F9" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Show Shortcut Key" {...formItemLayout}>
            <Input value="Ctrl + Alt + H " size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Insert Member" {...formItemLayout}>
            <Input value="Ctrl + Alt + M " size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Insert Employee" {...formItemLayout}>
            <Input value="Ctrl + Alt + C " size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Discount 1 (%)" {...formItemLayout}>
            <Input value="Ctrl + Shift + 1" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Discount 2 (%)" {...formItemLayout}>
            <Input value="Ctrl + Shift + 2" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Discount 3 (%)" {...formItemLayout}>
            <Input value="Ctrl + Shift + 3" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Discount Nominal" {...formItemLayout}>
            <Input value="Ctrl + Shift + 4" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
          <FormItem label="Quantity" {...formItemLayout}>
            <Input value="Ctrl + Shift + K" size="large" style={{ fontSize: 20 }} disabled />
          </FormItem>
        </Form>
      </Card>
    </Modal>
  )
}

export default ModalHelp
