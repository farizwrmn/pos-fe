import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, InputNumber, Form, Col, Row, Modal } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

const PaymentList = ({ onChooseItem, DeleteItem, onChangeTotalItem, item, form: { getFieldDecorator, validateFields, getFieldsValue } }) => {
  const handleTotalChange = () => {
    const data = getFieldsValue()
    let H1 = ((parseFloat(data.price) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
    let H2 = H1 * (1 - (data.disc2 / 100))
    let H3 = H2 * (1 - (data.disc3 / 100))
    let TOTAL = H3 - data.discount
    data.total = TOTAL
    data.productId = item.productId
    data.typeCode = item.typeCode
    onChangeTotalItem(data)
    return data
  }
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...handleTotalChange()
      }
      data.typeCode = item.typeCode
      data.productId = item.productId
      onChooseItem(data)
    })
  }
  const handleDelete = () => {
    const data = {
      Record: item.no,
      Payment: 'Delete',
      VALUE: 0
    }
    confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk () {
        console.log('Ok')
        DeleteItem(data)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  return (
    <Form>
      <FormItem {...formItemLayout} label="no">
        {getFieldDecorator('no', {
          initialValue: item.no,
          rules: [{
            required: true,
            message: 'Required'
          }]
        })(
          <Input disabled />
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="Product Code">
        {getFieldDecorator('code', {
          initialValue: item.code,
          rules: [{
            required: true,
            message: 'Required'
          }]
        })(
          <Input disabled />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Product Name">
        {getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{
            required: true,
            message: 'Required'
          }]
        })(
          <Input disabled />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Price">
        {getFieldDecorator('price', {
          initialValue: item.price,
          rules: [{
            required: true,
            message: 'Required',
            pattern: /^([0-9.]{0,13})$/i
          }]
        })(
          <InputNumber
            min={0}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Qty">
        {getFieldDecorator('qty', {
          initialValue: item.qty,
          rules: [{
            required: true,
            message: 'Required',
            pattern: /^([0-9]{0,13})$/i
          }]
        })(
          <InputNumber
            defaultValue={0}
            min={0}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Disc1(%)">
        {getFieldDecorator('disc1', {
          initialValue: item.disc1,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,5})$/i
          }]
        })(
          <InputNumber
            defaultValue={0}
            min={0}
            max={100}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Disc2(%)">
        {getFieldDecorator('disc2', {
          initialValue: item.disc2,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,5})$/i
          }]
        })(
          <InputNumber
            defaultValue={0}
            min={0}
            max={100}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Disc3(%)">
        {getFieldDecorator('disc3', {
          initialValue: item.disc3,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,5})$/i
          }]
        })(
          <InputNumber
            defaultValue={0}
            min={0}
            max={100}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Discount Nominal" help="Total - Diskon Nominal">
        {getFieldDecorator('discount', {
          initialValue: item.discount,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,13})$/i
          }]
        })(
          <InputNumber
            defaultValue={0}
            min={0}
            max={item.price * item.qty}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Total">
        {getFieldDecorator('total', {
          initialValue: item.total,
          rules: [{
            required: true,
            message: 'Required'
          }]
        })(
          <Input disabled />
        )}
      </FormItem>
      <Row>
        <Col span={6}>
          <Button type="primary" onClick={handleClick}> Change </Button>
        </Col>
        <Col span={6}>
          <Button type="danger" onClick={handleDelete}> Delete </Button>
        </Col>
      </Row>
    </Form>
  )
}

PaymentList.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object,
  item: PropTypes.object,
  DeleteItem: PropTypes.func,
  totalItem: PropTypes.string,
  onChooseItem: PropTypes.func,
  onChangeTotalItem: PropTypes.func
}
export default Form.create()(PaymentList)
