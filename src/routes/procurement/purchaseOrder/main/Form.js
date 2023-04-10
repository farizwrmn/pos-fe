import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Select, DatePicker, Button, Row, Col, Modal } from 'antd'
import ListItem from './ListItem'

const FormItem = Form.Item
const { TextArea } = Input
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

const col = {
  lg: {
    span: 12,
    offset: 0
  }
}

const FormCounter = ({
  item = {},
  onSubmit,
  onGetProduct,
  onGetQuotation,
  listSupplier,
  listItemProps,
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

  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...col}>
          <FormItem label="No. Transaction" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: item.transNo,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input disabled maxLength={20} />)}
          </FormItem>
          <FormItem label="Deadline Receive" {...formItemLayout}>
            {getFieldDecorator('deadlineDate', {
              initialValue: moment().add('14', 'days'),
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<DatePicker />)}
          </FormItem>
          <FormItem required label="Supplier" {...formItemLayout}>
            {getFieldDecorator('supplierId', {
              initialValue: item.supplierId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
              disabled={item.supplierId}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >
              {supplierData}
            </Select>)}
          </FormItem>
          <Button type="default" size="large" onClick={() => onGetProduct()}>Product</Button>
          <Button type="primary" size="large" onClick={() => onGetQuotation()} style={{ marginLeft: '10px' }}>Quotation</Button>
        </Col>
        <Col {...col}>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true
                }
              ]
            })(<TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 5 }} />)}
          </FormItem>
        </Col>
      </Row>
      <ListItem {...listItemProps} style={{ marginTop: '10px' }} />
      <Button type="primary" onClick={handleSubmit} style={{ float: 'right', marginTop: '10px' }}>Save</Button>
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
