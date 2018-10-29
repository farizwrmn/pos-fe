import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form, Col, Row, Modal, InputNumber } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 }
}

const AdjustList = ({ onOk, onDeleteItem, item, disabledItemIn, disabledItemOut, form: { resetFields, getFieldDecorator, validateFields, getFieldsValue }, ...editProps }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.Record = item.no
      data.productId = item.productId
      onOk(data)
      resetFields()
    })
  }

  const handleDelete = () => {
    const Record = {
      ...getFieldsValue()
    }
    const data = {
      Record: Record.Record
    }
    confirm({
      title: `Remove Record ${item.name} ?`,
      content: `Record ${item.name} will remove from list !`,
      onOk () {
        onDeleteItem(data)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  return (
    <Modal footer={null} closable {...editProps}>
      <Form>
        <FormItem {...formItemLayout} label="No">
          {getFieldDecorator('Record', {
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
        <FormItem {...formItemLayout} label="Product">
          <Input value={item.name} />
        </FormItem>
        <FormItem {...formItemLayout} label="Code">
          <Input value={item.code} />
        </FormItem>
        <FormItem {...formItemLayout} label="Cost Price">
          {getFieldDecorator('price', {
            initialValue: item.price,
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="In">
          {getFieldDecorator('InQty', {
            initialValue: item.In,
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(<InputNumber disabled={disabledItemIn} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Out">
          {getFieldDecorator('OutQty', {
            initialValue: item.Out,
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(
            <InputNumber disabled={disabledItemOut} />
          )
          }
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
    </Modal>
  )
}

AdjustList.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object,
  item: PropTypes.object,
  onChooseItem: PropTypes.func,
  disabledItemIn: PropTypes.bool.isRequired,
  disabledItemOut: PropTypes.bool
}
export default Form.create()(AdjustList)
