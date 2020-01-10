import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, Row, Col, Modal, Checkbox } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

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
  listPayment,
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
      data.parentId = data.parentId ? data.parentId.key : null
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }
  const parentList = (listPayment || []).length > 0 ? listPayment.map(c => <Option value={c.id} key={c.id}>{c.typeName}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Parent" hasFeedback {...formItemLayout}>
            {getFieldDecorator('parentId', {
              initialValue: item.parentId ? {
                key: item.parentId,
                label: item.paymentParentName
              } : {},
              rules: [
                {
                  required: false
                }
              ]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              labelInValue
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >{parentList}
            </Select>)}
          </FormItem>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeCode', {
              initialValue: item.typeCode,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={10} autoFocus />)}
          </FormItem>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeName', {
              initialValue: item.typeName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={30} />)}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={30} />)}
          </FormItem>
          <FormItem label="Status" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: item.status === undefined ? true : Number(item.status)
            })(<Checkbox>Active</Checkbox>)}
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
