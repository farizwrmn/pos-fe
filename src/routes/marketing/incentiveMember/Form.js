import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Table, Button, Row, Col, Modal, Card, Select, DatePicker } from 'antd'
import moment from 'moment'
import ModalMemberTier from './ModalMemberTier'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

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
  listAllStores,
  onOpenModalTier,
  modalMemberTierProps,
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

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const response = {
        incentiveCode: data.incentiveCode,
        incentiveName: data.incentiveName,
        startDate: (data.Date || []).length > 0 ? moment(data.Date[0]).format('YYYY-MM-DD') : null,
        endDate: (data.Date || []).length > 0 ? moment(data.Date[1]).format('YYYY-MM-DD') : null,
        storeId: (data.storeId || []).length > 0 ? data.storeId : null,
        listTier
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(response, resetFields)
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
                    pattern: /^[a-z0-9-/]{3,50}$/i
                  }
                ]
              })(<Input maxLength={50} disabled />)}
            </FormItem>
            <FormItem label="Incentive Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('incentiveName', {
                initialValue: item.incentiveName,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input maxLength={50} autoFocus />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem
              label="Store"
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('storeId', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  mode="default"
                  allowClear
                  size="large"
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Choose Store"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {childrenTransNo}
                </Select>
              )}
            </FormItem>
            <FormItem label="Available Period" hasFeedback {...formItemLayout}>
              {getFieldDecorator('Date', {
                initialValue: item.startDate ? [
                  moment(item.startDate),
                  moment(item.endDate)
                ] : null,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<RangePicker disabledDate={disabledDate} allowClear />)}
            </FormItem>
          </Col>
        </Row>
      </Card>
      <Card
        title={(
          <div>
            <span style={{ marginRight: '10px' }}>Add Tier Information</span>
            <Button type="primary" onClick={() => onOpenModalTier('add')}>Add Item +</Button>
          </div>
        )}
        style={{ margin: '10px 0' }}
      >
        <Table
          dataSource={listTier}
          pagination={false}
          bordered
          onRowClick={record => onOpenModalTier('edit', record)}
          columns={columnTier}
          simple
          scroll={{ x: 700 }}
        />
      </Card>
      <FormItem {...tailFormItemLayout}>
        {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
        <Button type="primary" onClick={handleSubmit}>{button}</Button>
      </FormItem>
      {modalMemberTierProps.visible && <ModalMemberTier {...modalMemberTierProps} />}
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
