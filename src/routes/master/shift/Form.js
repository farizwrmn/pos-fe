import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal, message, Select, TimePicker } from 'antd'
import moment from 'moment'
import Search from 'antd/lib/input/Search';

const FormItem = Form.Item
const Option = Select.Option
const format = 'HH:mm'

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

const formShift = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  searchSequence,
  listShift,
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

  let sequences = []
  sequences.push(<Option value={0}>-</Option>)
  if (listShift && listShift.length > 0) {
    if (modalType === 'edit') {
      listShift = listShift.filter(x => x.id !== item.id)
    }
    listShift.map(x => sequences.push(<Option value={x.id}>{x.shiftName}</Option>))
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.start = moment(data.start).format(format)
      data.end = moment(data.end).format(format)
      console.log(data)
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

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.shiftName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} autoFocus />)}
          </FormItem>
          <FormItem label="Start Time" hasFeedback {...formItemLayout}>
            {getFieldDecorator('start', {
              initialValue: item.endTime ? moment(item.startTime, format) : '',
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
          </FormItem>
          <FormItem label="End Time" hasFeedback {...formItemLayout}>
            {getFieldDecorator('end', {
              initialValue: item.endTime ? moment(item.endTime, format) : '',
              rules: [
                {
                  required: true
                }
              ]
            })(<TimePicker format={format} />)}
          </FormItem>
          <FormItem label="Sequence" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sequence', {
              initialValue: item.sequence ? item.sequence : 0
            })(<Select
              onFocus={() => searchSequence()}
            >
              {sequences}
            </Select>)}
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

formShift.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(formShift)
