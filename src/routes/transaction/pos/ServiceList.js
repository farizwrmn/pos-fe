import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, InputNumber, Form, Col, Row, Modal } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
}

const PaymentList = ({ DeleteItem, onChooseItem, onChangeTotalItem, itemService, form: { getFieldDecorator, validateFields, getFieldsValue }, ...modalPaymentProps }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...handleTotalChange(),
      }
      data.typeCode = itemService.typeCode
      data.productId = itemService.productId
      onChooseItem(data)
    })
  }
  const handleTotalChange = () => {
    const data = getFieldsValue()
    let H1 = ((parseFloat(data.price) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
    let H2 = H1 * (1 - (data.disc2 / 100))
    let H3 = H2 * (1 - (data.disc3 / 100))
    let TOTAL = H3 - data.discount
    data.total = TOTAL
    data.typeCode = itemService.typeCode
    data.productId = itemService.productId
    onChangeTotalItem(data)
  }

  const handleDelete = () => {
    const Record = {
      ...getFieldsValue(),
    }
    const data = {
      Record: itemService.no,
      Payment: 'Delete',
      VALUE: 0,
    }
    confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk() {
        DeleteItem(data)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <Form>
      <FormItem {...formItemLayout} label="no">
        {getFieldDecorator('no', {
          initialValue: itemService.no,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input disabled />
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="Service Code">
        {getFieldDecorator('code', {
          initialValue: itemService.code,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input disabled />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Service Name">
        {getFieldDecorator('name', {
          initialValue: itemService.name,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input disabled />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Price">
        {getFieldDecorator('price', {
          initialValue: itemService.price,
          rules: [{
            required: true,
            message: 'Required',
            pattern: /^([0-9.]{0,13})$/i,
          }],
        })(
          <InputNumber
            min={0}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Qty">
        {getFieldDecorator('qty', {
          initialValue: itemService.qty,
          rules: [{
            required: true,
            message: 'Required',
            pattern: /^([0-9]{0,13})$/i,
          }],
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
          initialValue: itemService.disc1,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,5})$/i,
          }],
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
          initialValue: itemService.disc2,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,5})$/i,
          }],
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
          initialValue: itemService.disc3,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,5})$/i,
          }],
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
          initialValue: itemService.discount,
          rules: [{
            required: true,
            message: 'Invalid',
            pattern: /^([0-9.]{0,13})$/i,
          }],
        })(
          <InputNumber
            defaultValue={0}
            min={0}
            max={itemService.total}
            onBlur={value => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Total">
        {getFieldDecorator('total', {
          initialValue: itemService.total,
          rules: [{
            required: true,
            message: 'Required',
          }],
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
  itemService: PropTypes.object,
  totalItem: PropTypes.string,
  onChooseItem: PropTypes.func,
  DeleteItem: PropTypes.func,
  onChangeTotalItem: PropTypes.func.isRequired,
}
export default Form.create()(PaymentList)
