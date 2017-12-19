import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, Form, InputNumber } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

const PurchaseList = ({ onChooseItem, onChangeTotalItem, onDelete, item, onCancel, form: { resetFields, getFieldDecorator, validateFields, getFieldsValue }, modalPurchaseVisible }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.code = item.code
      onChooseItem(data)
      resetFields()
    })
  }
  const hdlCancel = (e) => {
    onCancel()
  }
  const hdlChange = () => {
    const data = getFieldsValue()
    data.code = item.code
    let H1 = ((parseFloat(data.price) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
    let TOTAL = H1 - (parseFloat(data.discount))
    let tax = localStorage.getItem('taxType') ? localStorage.getItem('taxType') : 'E'
    if (tax === 'E') {
      data.dpp = TOTAL
      data.ppn = 0
    } else if (tax === 'I') {
      data.dpp = TOTAL
      data.ppn = TOTAL * 0.1
    }
    data.total = TOTAL + data.ppn
    onChangeTotalItem(data)
  }
  const handleDelete = () => {
    const data = getFieldsValue()
    Modal.confirm({
      title: `Are you sure Delete ${data.name} ?`,
      content: 'Delete cannot be undone',
      onOk() {
        onDelete(data)
        resetFields()
      },
      onCancel() {
        console.log('cancel')
      }
    })
  }
  return (
    <Modal visible={modalPurchaseVisible} onCancel={() => hdlCancel()} footer={[]}>
      <Form>
        <FormItem {...formItemLayout} label="No">
          {getFieldDecorator('no', {
            initialValue: item.no,
            rules: [{
              required: true,
              message: 'Required',
            }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Product Code">
          {getFieldDecorator('productCode', {
            initialValue: item.productCode,
            rules: [{
              required: true,
              message: 'Required',
            }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Product Name">
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{
              required: true,
              message: 'Required',
            }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Quantity">
          {getFieldDecorator('qty', {
            initialValue: item.qty,
            rules: [{
              required: true,
              pattern: /^([0-9.]{0,13})$/i,
              message: 'Quantity is not define',
            }],
          })(<InputNumber
            min={0}
            onBlur={value => hdlChange(value)}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Price">
          {getFieldDecorator('price', {
            initialValue: item.price,
            rules: [{
              required: true,
              pattern: /^([0-9.]{0,13})$/i,
              message: 'Price is not define',
            }],
          })(<Input
            maxLength={13}
            onBlur={value => hdlChange(value)}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc(%)">
          {getFieldDecorator('disc1', {
            initialValue: item.disc1,
            rules: [{
              required: true,
              pattern: /^([0-9.]{0,4})$/i,
              message: 'Discount is not define',
            }],
          })(<InputNumber min={0} max={100} onBlur={value => hdlChange(value)} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc(N)">
          {getFieldDecorator('discount', {
            initialValue: item.discount,
            rules: [{
              required: true,
              pattern: /^([0-9.]{0,13})$/i,
              message: 'Discount is not define',
            }],
          })(<InputNumber
            maxLength={13}
            min={0}
            max={(item.price * item.qty) - ((item.price * item.qty) * (item.disc1 / 100))}
            onBlur={value => hdlChange(value)}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="DPP">
          {getFieldDecorator('dpp', {
            initialValue: item.dpp,
            rules: [{
              required: true,
              message: 'DPP is not define',
            }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="PPN">
          {getFieldDecorator('ppn', {
            initialValue: item.ppn,
            rules: [{
              required: true,
              message: 'PPN is not define',
            }],
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Total">
          {getFieldDecorator('total', {
            initialValue: item.total,
            rules: [{
              required: true,
              pattern: /^([0-9.]{0,13})$/i,
              message: 'Total is not define',
            }],
          })(<Input disabled />)}
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
  onChangeTotalItem: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalPurchaseVisible: PropTypes.isRequired,
}
export default Form.create()(PurchaseList)
