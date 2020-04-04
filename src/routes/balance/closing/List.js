import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Modal, InputNumber, Row, Col } from 'antd'
import { lstorage } from 'utils'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const FormLabel = () => {
  return (
    <Row label={(<div />)} hasFeedback {...formItemLayout}>
      <Col {...formItemLayout.labelCol} />
      <Col {...formItemLayout.wrapperCol}>
        <Row>
          <Col span={8}><div>Sales</div></Col>
          <Col span={8}><div>Petty-Cash</div></Col>
          <Col span={8}><div>Consignment</div></Col>
        </Row>
      </Col>
    </Row>
  )
}

const FormComponent = ({
  label,
  name,
  getFieldDecorator
}) => {
  return (
    <FormItem label={label} hasFeedback {...formItemLayout}>
      <Row>
        <Col span={8}>
          <div>
            {getFieldDecorator(`detail[${name}][balanceIn]`, {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber min={0} style={{ width: '60%' }} />
            )}
          </div>
        </Col>
        <Col span={8}>
          {name === 'C' && (
            <div>
              {getFieldDecorator(`cash[${name}][balanceIn]`, {
                initialValue: 0,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <InputNumber min={0} style={{ width: '60%' }} />
              )}
            </div>
          )}
        </Col>
        <Col span={8}>
          <div>
            {getFieldDecorator(`consignment[${name}][balanceIn]`, {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber min={0} style={{ width: '60%' }} />
            )}
          </div>
        </Col>
      </Row>
    </FormItem>
  )
}

const List = ({
  listOpts = [],
  button,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        storeId: lstorage.getCurrentUserStore(),
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

  return (
    <Form layout="horizontal">
      <FormLabel />
      {listOpts && listOpts.map(item => (
        <FormComponent
          getFieldDecorator={getFieldDecorator}
          label={item.typeName}
          name={item.typeCode}
        />
      ))}
      <Button type="primary" onClick={handleSubmit}>{button}</Button>
    </Form>
  )
}

List.propTypes = {
  button: PropTypes.string,
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
}

export default Form.create()(List)
