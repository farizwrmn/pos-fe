import React from 'react'
import { Form, Modal, Button, InputNumber, Switch, Input } from 'antd'

const FormItem = Form.Item

const EditProductForm = ({
  item,
  loading,
  editVisible,
  onCloseEditVisible,
  form: {
    getFieldDecorator,
    getFieldsValue,
    resetFields
  },
  onEdit
}) => {
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }

  const handleSubmit = () => {
    const record = {
      ...item,
      ...getFieldsValue()
    }
    record.active = Number(record.active)
    Modal.confirm({
      title: `Edit ${record.productName}`,
      content: 'Are you sure ?',
      onOk () {
        onEdit(record, resetFields)
      }
    })
  }

  return (
    <div>
      <Modal
        title="Edit Item"
        visible={editVisible}
        onCancel={onCloseEditVisible}
        footer={[]}
      >
        <Form>
          <FormItem label="Product Id" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productId', {
              initialValue: item.productId,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber min={0} />
            )}
          </FormItem>
          <FormItem label="Product Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productName', {
              initialValue: item.productName
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Active" hasFeedback {...formItemLayout}>
            {getFieldDecorator('active', {
              initialValue: Boolean(item.active)
            })(
              <Switch defaultChecked={Boolean(item.active)} />
            )}
          </FormItem>

          <FormItem wrapperCol={{ span: 16, offset: 8 }}>
            <Button disabled={loading.effects['pos/queryExpress'] || loading.effects['pos/editExpress']} style={{ float: 'right' }} type="primary" size="large" onClick={() => handleSubmit()}>
              Submit
            </Button>
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create()(EditProductForm)
