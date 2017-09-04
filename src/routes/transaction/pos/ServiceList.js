import React from 'react'
import PropTypes from 'prop-types'
import {Button, Input, Form, Select, Row, Col, Modal} from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
}

const ServiceList = ({ onChooseItem, itemService, form: { getFieldDecorator, validateFields, getFieldsValue }, ...modalPaymentProps }) => {
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onChooseItem(data)
    })
  }

  const handleDelete = () => {
    const Record = {
      ...getFieldsValue(),
    }
    const data = {
      Record: Record.Record,
      Payment: 'Delete',
      VALUE: 0,
    }
    confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk() {
        console.log('Ok')
        onChooseItem(data)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  return (
    <Form>
      <FormItem {...formItemLayout} label="Record">
        {getFieldDecorator('Record', {
          initialValue: itemService.no,
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input disabled />
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="Payment">
        {getFieldDecorator('Payment', {
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Select defaultValue="lucy" style={{width: 120}}>
            <Option value="discount">Discount Nominal</Option>
            <Option value="disc1">Disc 1(%)</Option>
            <Option value="disc2">Disc 2(%)</Option>
            <Option value="disc3">Disc 3(%)</Option>
          </Select>
        )
        }
      </FormItem>
      <FormItem {...formItemLayout} label="VALUE">
        {getFieldDecorator('VALUE', {
          rules: [{
            required: true,
            message: 'Required',
          }],
        })(
          <Input />
        )}
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
  )
}

ServiceList.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object,
  item: PropTypes.object,
  onChooseItem: PropTypes.func
}
export default Form.create()(ServiceList)
