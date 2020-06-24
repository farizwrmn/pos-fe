import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, message, Button, Row, Col, Modal, Select } from 'antd'
import { lstorage } from 'utils'
import ListDetail from './ListDetail'
import ModalList from './Modal'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 7 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  showLov,
  onSubmit,
  modalShow,
  modalShowList,
  resetListItem,
  listItem,
  modalVisible,
  modalProps,
  listDetailProps,
  updateCurrentItem,
  form: {
    getFieldDecorator,
    getFieldValue,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields
  },
  inputType = getFieldValue('type')
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.storeId = lstorage.getCurrentUserStore()
      data.memberId = data.memberId ? data.memberId.key : null
      data.supplierId = data.supplierId ? data.supplierId.key : null
      data.transType = data.transType ? data.transType.key : null
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, listItem, getFieldsValue())
          resetFields()
        },
        onCancel () { }
      })
    })
  }
  const hdlModalShow = () => {
    validateFields(['type'], (errors) => {
      if (errors) {
        message.warning('Type is required', 1.5)
        return
      }
      const type = getFieldValue('type')
      modalShow(type)
    })
  }

  const hdlModalReset = () => {
    const oldType = getFieldValue('type')
    const oldSupplierId = getFieldValue('supplierId')
    const oldMemberId = getFieldValue('memberId')
    validateFields(['type', 'supplierId', 'memberId'], (errors) => {
      if (errors) {
        return
      }
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          const type = getFieldValue('type')
          resetListItem(type)
        },
        onCancel () {
          if (oldType === 'I') {
            setFieldsValue({
              type: oldType
            })
            updateCurrentItem({
              memberId: {
                key: oldMemberId ? oldMemberId.key : null,
                label: oldMemberId ? oldMemberId.label : null
              },
              supplierId: {
                key: null,
                label: null
              },
              ...item
            })
          } else if (oldType === 'E') {
            setFieldsValue({
              type: oldType
            })
            updateCurrentItem({
              supplierId: {
                key: oldSupplierId ? oldSupplierId.key : null,
                label: oldSupplierId ? oldSupplierId.label : null
              },
              memberId: {
                key: null,
                label: null
              },
              ...item
            })
          }
        }
      })
    })
  }

  const modalOpts = {
    showLov,
    inputType: getFieldValue('type'),
    ...modalProps
  }

  const handleModalShowList = (record) => {
    validateFields(['type', 'supplierId', 'memberId'], (errors) => {
      if (errors) {
        return
      }
      record.accountId = {
        key: record.accountId,
        label: record.accountName
      }
      modalShowList(record)
    })
  }

  const listDetailOpts = {
    handleModalShowList,
    listItem,
    ...listDetailProps
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <FormItem label="Trans No" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled maxLength={30} />)}
            </FormItem>
            <FormItem label="Reference" hasFeedback {...formItemLayout}>
              {getFieldDecorator('reference', {
                initialValue: item.reference
              })(<Input maxLength={40} autoFocus />)}
            </FormItem>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description')(<Input />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem label="Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: item.type,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  allowClear
                  onChange={() => hdlModalReset()}
                >
                  <Option value="E">Out</Option>
                  <Option value="I">In</Option>
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...column}>
            <Button type="primary" size="large" onClick={() => hdlModalShow()} style={{ marginBottom: '8px' }}>Add</Button>
          </Col>
          <Col {...column} />
        </Row>
        <Row style={{ marginBottom: '8px' }}>
          <ListDetail {...listDetailOpts} />
        </Row>
        <Row>
          <Col {...column} />
          <Col {...column}>
            <FormItem>
              {/* {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>} */}
              <Button type="primary" onClick={handleSubmit} style={{ float: 'right' }}>Save</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      {modalVisible && (inputType === 'I' || inputType === 'E') && <ModalList {...modalOpts} />}
    </div>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
