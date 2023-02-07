import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal, Select, DatePicker, message } from 'antd'
import { lstorage } from 'utils'
import moment from 'moment'
import { FooterToolbar } from 'components'
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
  modalType,
  modalItemType,
  modalShowList,
  storeInfo,
  listItem,
  modalVisible,
  modalProps,
  listDetailProps,
  loading,
  onCancel,
  button,
  listAccountCode,
  listAccountCodeExpense,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []
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
      const transDate = moment(data.transDate).format('YYYY-MM-DD')
      data.transDate = transDate
      if (transDate < storeInfo.startPeriod) {
        message.error('This period has been closed')
        return
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, listItem, getFieldsValue(), resetFields)
        },
        onCancel () { }
      })
    })
  }
  const hdlModalShow = () => {
    modalShow()
  }

  const modalOpts = {
    showLov,
    modalItemType,
    ...modalProps
  }

  const handleModalShowList = (record) => {
    modalShowList(record)
  }

  const listDetailOpts = {
    handleModalShowList,
    listItem,
    listAccountCode: listAccountCodeExpense,
    ...listDetailProps
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
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
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input maxLength={255} />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem {...formItemLayout} label="Account Code">
              {getFieldDecorator('accountId', {
                initialValue: item.accountId,
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<Select
                showSearch
                allowClear
                placeholder="Choose Account Code"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >{listAccountOpt}
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="Trans Date">
              {getFieldDecorator('transDate', {
                initialValue: item.transDate ? moment(item.transDate) : moment(),
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<DatePicker />)}
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
        <FooterToolbar>
          <FormItem>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button disabled={loading} type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </FooterToolbar>
      </Form>
      {modalVisible ? <ModalList {...modalOpts} /> : null}
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
