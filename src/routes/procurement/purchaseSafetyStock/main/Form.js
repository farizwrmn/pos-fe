import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, DatePicker, Button, Row, Col, Modal } from 'antd'

const FormItem = Form.Item
const { RangePicker } = DatePicker
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
  modalType,
  listDistributionCenter,
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

  let listStore = listDistributionCenter.map(x => (<Option title={x.storeName} value={x.id} key={x.id}>{x.storeName}</Option>))

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

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <h1>Generate Safety Stock</h1>
          <FormItem label="Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('rangeDate', {
              initialValue: item.rangeDate,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <RangePicker size="large" format="DD-MMM-YYYY" />
            )}
          </FormItem>
          <FormItem label="Distribution Center" hasFeedback {...formItemLayout}>
            {getFieldDecorator('purchaseStoreId', {
              initialValue: item.purchaseStoreId,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select
                mode={modalType === 'add' ? 'multiple' : 'default'}
                size="large"
                style={{ width: '100%' }}
                placeholder="Choose Store"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listStore}
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={handleSubmit}>Add</Button>
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
