import React from 'react'
import { Input, Row, Col, Button, Form, Modal, Select } from 'antd'
import debounce from 'lodash/debounce'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 3 },
    md: { span: 2 },
    lg: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 12 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormType = ({ item, listModel, onSubmit, onCancel, formType, callModel, form: { getFieldDecorator, getFieldsValue, validateFields, resetFields } }) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: { offset: formType === 'edit' ? 10 : 19 },
      sm: { offset: formType === 'edit' ? 5 : 9 },
      md: { offset: formType === 'edit' ? 4 : 8 },
      lg: { offset: formType === 'edit' ? 7 : 12 }
    }
  }

  const handleCancel = () => {
    onCancel()
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
          onSubmit(data)
          resetFields()
        },
        onCancel () { }
      })
    })
  }

  const models = (listModel && listModel.length) ? listModel.map(x => (<Option value={x.id}>{x.modelName}</Option>)) : []

  const fetchModel = (value) => {
    callModel(value)
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Model" hasFeedback {...formItemLayout}>
            {getFieldDecorator('modelId', {
              initialValue: item.modelId,
              rules: [{ required: true }]
            })(<Select
              showSearch
              autoFocus
              placeholder="Select Model"
              optionFilterProp="children"
              filterOption={false}
              onSearch={debounce(fetchModel, 200)}
            >
              {models}
            </Select>)}
          </FormItem>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeName', {
              initialValue: item.typeName,
              rules: [{ required: true }]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {formType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{formType === 'edit' ? 'Update' : 'Save'}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

export default Form.create()(FormType)
