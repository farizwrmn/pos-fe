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
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []
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
      if (data.accountCode && data.accountCode.key) {
        data.accountCode = data.accountCode && data.accountCode.key ? data.accountCode : undefined
        data.accountId = data.accountCode && data.accountCode.key ? data.accountCode.key : undefined
      } else {
        message.error('Choose Account Code')
        return
      }
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
    record.accountId = {
      key: record.accountId,
      label: record.accountName
    }
    modalShowList(record)
  }

  const listDetailOpts = {
    handleModalShowList,
    listItem,
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
                initialValue: item.description
              })(<Input maxLength={255} />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem {...formItemLayout} label="Account Code">
              {getFieldDecorator('accountCode', {
                initialValue: item.accountCode ? {
                  key: item.accountCode.key,
                  label: item.accountCode.label
                } : { label: 'Choose Account Code' },
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<Select
                showSearch
                allowClear
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
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
      {modalVisible && <ModalList {...modalOpts} />}
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
