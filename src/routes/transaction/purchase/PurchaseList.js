import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, Form, Select } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

const PurchaseList = ({ onChooseItem, onDelete, item, onCancel, form: { resetFields, getFieldDecorator, validateFields, getFieldsValue }, modalPurchaseVisible }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onChooseItem(data)
      resetFields()
    })
  }
  const hdlCancel = (e) => {
    onCancel()
  }
  const handleDelete = () => {
    const data = {
      ...getFieldsValue(),
    }
    onDelete(data)
  }
  return (
    <Modal visible={modalPurchaseVisible} onCancel={() => hdlCancel()} footer={[]}>
      <Form>
        <FormItem {...formItemLayout} label="Record">
          {getFieldDecorator('Record', {
            initialValue: item.no,
            rules: [{
              required: true,
              message: 'Required',
            }],
          })(
            <Input disabled />
          )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="Detail">
          {getFieldDecorator('Detail', {
            rules: [{
              required: true,
              message: 'Required',
            }],
          })(
            <Select defaultValue="discount" style={{width: 120}}>
              <Option value="discount">Discount Nominal</Option>
              <Option value="disc1">Disc(%)</Option>
              <Option value="qty">Quantity</Option>
              <Option value="price">PRICE</Option>
            </Select>
          )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="VALUE">
          {getFieldDecorator('VALUE', {
            rules: [{
              required: true,
              message: 'Required',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <Button type="primary" onClick={handleClick}> Change </Button>
        <Button type="danger" onClick={handleDelete} style={{ marginLeft: '5px' }}> Delete </Button>
      </Form>
    </Modal>
  )
}

PurchaseList.propTypes = {
  form: PropTypes.isRequired,
  pos: PropTypes.isRequired,
  item: PropTypes.isRequired,
  onChooseItem: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalPurchaseVisible: PropTypes.isRequired,
}
export default Form.create()(PurchaseList)
