import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, InputNumber, Form, Col, Row, Modal } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
}

const PaymentList = ({ totalItem, onChooseItem, onChangeTotalItem, item, form: { getFieldDecorator, validateFields, getFieldsValue }, ...modalPaymentProps }) => {
  let total = totalItem
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.total = total
      data.no = data.Record
      delete data.Record
      data.productId = item.productId
      onChooseItem(data)
    })
  }
  const handleTotalChange = () => {
    const data = getFieldsValue()
    let H1 = ((parseFloat(data.price) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
    let H2 = H1 * (1 - (data.disc2 / 100))
    let H3 = H2 * (1 - (data.disc3 / 100))
    let TOTAL = H3 - data.discount
    onChangeTotalItem(TOTAL)
  }

  const handleDelete = () => {
    const Record = {
      ...getFieldsValue(),
    }
    const data = {
      Record: Record.Record,
      Payment: 'Delete',
      VALUE: 0,
    }
    confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk() {
        console.log('Ok')
        onChooseItem(data)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
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
      {/*<FormItem {...formItemLayout} label="Payment">*/}
      {/*{getFieldDecorator('Payment', {*/}
      {/*rules: [{*/}
      {/*required: true,*/}
      {/*message: 'Required',*/}
      {/*}],*/}
      {/*})(*/}
      {/*<Select defaultValue="lucy" style={{width: 120}}>*/}
      {/*<Option value="discount">Discount Nominal</Option>*/}
      {/*<Option value="disc1">Disc 1(%)</Option>*/}
      {/*<Option value="disc2">Disc 2(%)</Option>*/}
      {/*<Option value="disc3">Disc 3(%)</Option>*/}
      {/*<Option value="quantity">Quantity</Option>*/}
      {/*</Select>*/}
      {/*)*/}
      {/*}*/}
      {/*</FormItem>*/}
      {/*<FormItem {...formItemLayout} label="VALUE">*/}
      {/*{getFieldDecorator('VALUE', {*/}
      {/*rules: [{*/}
      {/*required: true,*/}
      {/*message: 'Required',*/}
      {/*}],*/}
      {/*})(*/}
      {/*<Input />*/}
      {/*)}*/}
      {/*</FormItem>*/}
      <FormItem {...formItemLayout} label="Product Code">
        {getFieldDecorator('code', {
          initialValue: item.code,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input disabled />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Product Name">
        {getFieldDecorator('name', {
          initialValue: item.name,
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
          initialValue: item.price,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input
            onBlur={(value) => handleTotalChange(value)}
            onEnter={(value) => handleTotalChange(value)}
            onFocus={(value) => handleTotalChange(value)}
            onChange={(value) => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Qty">
        {getFieldDecorator('qty', {
          initialValue: item.qty,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <InputNumber
            defaultValue={0}
            onBlur={(value) => handleTotalChange(value)}
            onEnter={(value) => handleTotalChange(value)}
            onFocus={(value) => handleTotalChange(value)}
            onChange={(value) => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Disc1(%)">
        {getFieldDecorator('disc1', {
          initialValue: item.disc1,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <InputNumber
            defaultValue={0}
            onBlur={(value) => handleTotalChange(value)}
            onEnter={(value) => handleTotalChange(value)}
            onFocus={(value) => handleTotalChange(value)}
            onChange={(value) => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Disc2(%)">
        {getFieldDecorator('disc2', {
          initialValue: item.disc2,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <InputNumber
            defaultValue={0}
            onBlur={(value) => handleTotalChange(value)}
            onEnter={(value) => handleTotalChange(value)}
            onFocus={(value) => handleTotalChange(value)}
            onChange={(value) => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Disc3(%)">
        {getFieldDecorator('disc3', {
          initialValue: item.disc3,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <InputNumber
            defaultValue={0}
            onBlur={(value) => handleTotalChange(value)}
            onEnter={(value) => handleTotalChange(value)}
            onFocus={(value) => handleTotalChange(value)}
            onChange={(value) => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Discount Nominal" help="Total - Diskon Nominal">
        {getFieldDecorator('discount', {
          initialValue: item.discount,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <InputNumber
            defaultValue={0}
            onBlur={(value) => handleTotalChange(value)}
            onEnter={(value) => handleTotalChange(value)}
            onFocus={(value) => handleTotalChange(value)}
            onChange={(value) => handleTotalChange(value)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Total">
        <Input value={total} />
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
  totalItem: PropTypes.string,
  onChooseItem: PropTypes.func,
  onChangeTotalItem: PropTypes.func.isRequired,
}
export default Form.create()(PaymentList)
