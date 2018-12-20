import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Table, InputNumber, Button, Row, Col, Modal, Select } from 'antd'
import { lstorage } from 'utils'

const Option = Select.Option
const { getListUserStores } = lstorage

const FormItem = Form.Item

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
  lg: { span: 18 },
  xl: { span: 18 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  clickRow,
  months,
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
  const data = getListUserStores()
  const Options = (data || []).length > 0 ? data.map(data => <Option value={data.value} key={data.value}>{data.label}</Option>) : []

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        category: item.category,
        brand: item.brand,
        ...getFieldsValue()
      }
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

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month'
    }
  ]

  const onRowClickTarget = (record, index) => {
    Modal.confirm({
      title: `Edit ${months[index].month} sales target`,
      onOk () {
        clickRow(record, index)
      }
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Store" hasFeedback {...formItemLayout}>
            {getFieldDecorator('storeId', {
              initialValue: item.storeId ? item.storeId : lstorage.getCurrentUserStore(),
              rules: [
                {
                  required: true
                }
              ]
            })(<Select disabled={modalType === 'edit'} placeholder="Choose Store">
              {Options}
            </Select>)}
          </FormItem>
          <FormItem label="Year" hasFeedback {...formItemLayout}>
            {getFieldDecorator('year', {
              initialValue: item.year,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={2017} max={2999} maxLength={4} autoFocus />)}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: false
                }
              ]
            })(<Input maxLength={140} />)}
          </FormItem>
          <FormItem label="Target" hasFeedback {...formItemLayout}>
            <Table onRowClick={onRowClickTarget} showHeader={false} bordered pagination={false} dataSource={months || []} columns={columns} />
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
