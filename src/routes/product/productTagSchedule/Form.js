import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Select, DatePicker, Row, Col, Spin, Modal } from 'antd'

const { RangePicker } = DatePicker
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
  listTag,
  onSubmit,
  onCancel,
  modalType,
  fetching,
  listProduct,
  childrenProduct = listProduct && listProduct.length > 0 ? listProduct.map(x => (<Option key={x.id}>{`${x.productName} (${x.productCode})`}</Option>)) : [],
  showLov,
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
      data.scheduleExecuteStart = (data.Date || []).length > 0 ? moment(data.Date[0]).format('YYYY-MM-DD') : null
      data.scheduleExecuteEnd = (data.Date || []).length > 0 ? moment(data.Date[1]).format('YYYY-MM-DD') : null
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const productTag = (listTag || []).length > 0 ? listTag.map(c => <Option value={c.tagCode} key={c.tagCode} title={c.tagDescription}>{c.tagCode} ({c.tagDescription})</Option>) : []
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current < moment().add(1, 'day').startOf('day')
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Tag" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tagCode', {
              initialValue: item.tagCode,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              optionFilterProp="children"
              placeholder="Choose Tag"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >{productTag}
            </Select>)}
          </FormItem>
          <FormItem label="Product" hasFeedback {...formItemLayout} >
            {getFieldDecorator('productId', {
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select
                onSearch={value => showLov('productstock', { q: value })}
                allowClear
                showSearch
                size="large"
                style={{ width: '100%' }}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                placeholder="Choose Product"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenProduct}
              </Select>
            )}
          </FormItem>
          <FormItem label="Available Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('Date', {
              initialValue: null,
              rules: [
                {
                  required: true
                }
              ]
            })(<RangePicker disabledDate={disabledDate} allowClear />)}
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
