import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Button, Row, Col, Modal, Select } from 'antd'
import { lstorage } from 'utils'

const FormItem = Form.Item
const { Option } = Select

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
  button,
  form: {
    getFieldDecorator,
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

  const listStore = lstorage.getListUserStores()
  const childrenStore = listStore && listStore.length > 0 ? listStore.map(x => (<Option value={x.value} key={x.value} title={x.label}>{x.label}</Option>)) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Distribution Center" hasFeedback {...formItemLayout}>
            {getFieldDecorator('storeId', {
              initialValue: lstorage.getCurrentUserStore(),
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              disabled
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {childrenStore}
            </Select>)}
          </FormItem>
          <FormItem label="Store" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sellingStoreId', {
              initialValue: item.sellingStoreId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              disabled={modalType === 'edit'}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {childrenStore}
            </Select>)}
          </FormItem>
          <FormItem label="leadTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('leadTime', {
              initialValue: item.leadTime || 3,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={1} max={100} />)}
          </FormItem>
          <FormItem label="safetyStock" hasFeedback {...formItemLayout}>
            {getFieldDecorator('safetyStock', {
              initialValue: item.safetyStock || 2,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={1} max={100} />)}
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
