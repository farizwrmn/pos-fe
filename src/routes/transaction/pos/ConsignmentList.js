import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, InputNumber, Form, Modal } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

const PaymentList = ({
  DeleteItem,
  onChooseItem,
  onChangeTotalItem,
  itemConsignment,
  listMechanic,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  ...modalProps }) => {
  const handleTotalChange = () => {
    const data = getFieldsValue()
    let H1 = ((parseFloat(data.price) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
    let H2 = H1 * (1 - (data.disc2 / 100))
    let H3 = H2 * (1 - (data.disc3 / 100))
    let TOTAL = H3 - data.discount
    data.total = TOTAL
    data.typeCode = itemConsignment.typeCode
    data.productId = itemConsignment.productId
    data.code = itemConsignment.code
    data.stock = itemConsignment.stock
    data.name = itemConsignment.name
    const { employee, ...other } = data
    onChangeTotalItem(other)
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
      data.typeCode = itemConsignment.typeCode
      data.productId = itemConsignment.productId
      data.code = itemConsignment.code
      data.name = itemConsignment.name
      onChooseItem(data)
    })
  }

  const handleDelete = () => {
    const data = {
      Record: itemConsignment.no,
      Payment: 'Delete',
      VALUE: 0
    }
    confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk () {
        DeleteItem(data)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  return (
    <Modal
      footer={[
        (<Button type="danger" onClick={handleDelete} disabled={!(itemConsignment.bundleId !== undefined && itemConsignment.bundleId !== null)}>Void</Button>),
        // (<Button type="danger" onClick={handleDelete} disabled={(itemConsignment.bundleId !== undefined && itemConsignment.bundleId !== null)}>Delete</Button>),
        (<Button type="primary" onClick={handleClick}>Submit</Button>)
      ]}
      {...modalProps}
    >
      <Form>
        <FormItem {...formItemLayout} label="no">
          {getFieldDecorator('no', {
            initialValue: itemConsignment.no,
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
            initialValue: itemConsignment.price,
            rules: [{
              required: true,
              message: 'Required',
              pattern: /^([0-9.]{0,13})$/i
            }]
          })(
            <InputNumber
              disabled
              min={0}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Qty">
          {getFieldDecorator('qty', {
            initialValue: itemConsignment.qty,
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
            initialValue: itemConsignment.disc1,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              disabled
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc2(%)">
          {getFieldDecorator('disc2', {
            initialValue: itemConsignment.disc2,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              disabled
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc3(%)">
          {getFieldDecorator('disc3', {
            initialValue: itemConsignment.disc3,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              disabled
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Discount Nominal" help="Total - Diskon Nominal">
          {getFieldDecorator('discount', {
            initialValue: itemConsignment.discount,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,13})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              disabled
              min={0}
              max={itemConsignment.total}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Total">
          {getFieldDecorator('total', {
            initialValue: itemConsignment.total,
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(
            <Input disabled />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

PaymentList.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object,
  itemConsignment: PropTypes.object,
  totalItem: PropTypes.string,
  onChooseItem: PropTypes.func,
  DeleteItem: PropTypes.func,
  onChangeTotalItem: PropTypes.func
}
export default Form.create()(PaymentList)
