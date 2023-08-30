import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Select, Row, Col, Modal, DatePicker } from 'antd'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  listStore,
  button,
  form: {
    getFieldDecorator,
    getFieldValue,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  let childrenStoreReceived = []
  if (listStore.length > 0) {
    if (item.storeId) {
      let groupStore = []
      for (let id = 0; id < listStore.length; id += 1) {
        groupStore.push(
          <Option disabled={item.storeId === listStore[id].value || getFieldValue('storeIdReceiver') === listStore[id].value} value={listStore[id].value}>
            {listStore[id].label}
          </Option>
        )
      }
      childrenStoreReceived.push(groupStore)
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="To Store" hasFeedback {...formItemLayout}>
            {getFieldDecorator('storeIdReceiver', {
              initialValue: item.storeIdReceiver,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select>
              {childrenStoreReceived}
            </Select>)}
          </FormItem>
          <FormItem label="Sales Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('salesDate', {
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9-/]{3,9}$/i
                }
              ]
            })(<RangePicker />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
