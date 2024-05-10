import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Table, Button, Row, Col, Modal, Card } from 'antd'

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
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  button,
  listTier,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const columnTier = [
    {
      title: 'Tier Number',
      dataIndex: 'tierNumber',
      key: 'tierNumber'
    },
    {
      title: 'Reward',
      dataIndex: 'tierReward',
      key: 'tierReward'
    },
    {
      title: 'Minimum New Member',
      dataIndex: 'minNewMember',
      key: 'minNewMember'
    },
    {
      title: 'Maximum New Nember',
      dataIndex: 'maxNewMember',
      key: 'maxNewMember'
    }
  ]
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

  return (
    <Form layout="horizontal">
      <Card title="General Information" style={{ margin: '10px 0' }}>
        <Row>
          <Col {...column}>
            <FormItem label="Incentive Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('incentiveCode', {
                initialValue: item.incentiveCode,
                rules: [
                  {
                    required: true,
                    pattern: /^[a-z0-9-/]{3,9}$/i
                  }
                ]
              })(<Input maxLength={50} autoFocus />)}
            </FormItem>
            <FormItem label="Incentive Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('incentiveName', {
                initialValue: item.incentiveName,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input maxLength={50} />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem label="Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeId', {
                initialValue: item.storeId,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input maxLength={50} />)}
            </FormItem>
            <FormItem label="Start Period" hasFeedback {...formItemLayout}>
              {getFieldDecorator('startPeriod', {
                initialValue: item.startPeriod,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input maxLength={50} />)}
            </FormItem>
            <FormItem label="End Period" hasFeedback {...formItemLayout}>
              {getFieldDecorator('endPeriod', {
                initialValue: item.endPeriod,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input maxLength={50} />)}
            </FormItem>
          </Col>
        </Row>
      </Card>
      <Card title="Add Tier Information" style={{ margin: '10px 0' }}>
        <Table
          dataSource={listTier}
          pagination={false}
          bordered
          columns={columnTier}
          simple
          scroll={{ x: 1000, y: 388 }}
        />
      </Card>
      <FormItem {...tailFormItemLayout}>
        {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
        <Button type="primary" onClick={handleSubmit}>{button}</Button>
      </FormItem>
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
