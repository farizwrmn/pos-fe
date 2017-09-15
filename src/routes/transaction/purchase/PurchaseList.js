import React from 'react'
import PropTypes from 'prop-types'
import {Modal, Button, Input, Form, Select} from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 10},
}

const PurchaseList = ({onChooseItem, item, onCancel, form: {resetFields, getFieldDecorator, validateFields, getFieldsValue}, modalPurchaseVisible, ...purchaseProps}) => {
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
  const hdlCancel = () => {
    console.log('hdlCancel')
    onCancel()
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
              <Option value="ket">KETERANGAN</Option>
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
        <div>
          <Button onClick={handleClick}> Change </Button>
        </div>
      </Form>
    </Modal>
  )
}

PurchaseList.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object,
  item: PropTypes.object,
  onChooseItem: PropTypes.func,
}
export default Form.create()(PurchaseList)
