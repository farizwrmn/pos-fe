import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal, Select } from 'antd'
import ModalItem from './ModalItem'
import TransDetail from './TransDetail'

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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  sequence,
  item = {},
  listAccountCode,
  listAllStores,
  onSubmit,
  onCancel,
  modalType,
  onAddItem,
  modalItemProps,
  listItemProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
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

  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []
  const listStore = listAllStores.map(x => (<Option title={x.storeName} value={x.id} key={x.id}>{x.storeName}</Option>))

  return (
    <Form layout="horizontal">
      {modalItemProps.modalItemVisible && <ModalItem {...modalItemProps} />}
      <Row>
        <Col {...column}>
          <FormItem label="Trans No" hasFeedback {...formItemLayout}>
            {getFieldDecorator('transNo', {
              initialValue: item.transNo || sequence,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            label="From Store"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('fromStore', {
              rules: [{
                required: true
              }]
            })(
              <Select
                mode="default"
                size="large"
                style={{ width: '100%' }}
                placeholder="Choose StoreId"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {listStore}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Bank">
            {getFieldDecorator('accountId', {
              initialValue: item.accountId,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={filterOption}
            >{listAccountOpt}
            </Select>)}
          </FormItem>
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: false
                }
              ]
            })(<TextArea maxLength={255} autosize={{ minRows: 2, maxRows: 3 }} />)}
          </FormItem>
        </Col>
      </Row>
      <Button type="primary" style={{ margin: '10px 0' }} onClick={onAddItem}>Add</Button>
      <TransDetail {...listItemProps} />
      {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
      <Button type="primary" style={{ margin: '10px 0', float: 'right' }} onClick={handleSubmit}>Save</Button>
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
