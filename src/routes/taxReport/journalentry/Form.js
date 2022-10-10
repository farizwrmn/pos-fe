import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, message, Row, Col, Modal, DatePicker } from 'antd'
import { lstorage } from 'utils'
import { FooterToolbar } from 'components'
import moment from 'moment'
import ListDetail from './ListDetail'
import ModalList from './Modal'

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
  listAccountCode,
  storeInfo,
  showLov,
  onSubmit,
  modalShow,
  modalType,
  modalItemType,
  modalShowList,
  listItem,
  modalVisible,
  modalProps,
  listDetailProps,
  loading,
  onCancel,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const handleSubmit = () => {
    const debitTotal = listItem.reduce((cnt, o) => cnt + parseFloat(o.amountIn || 0), 0).toLocaleString()
    const creditTotal = listItem.reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0).toLocaleString()
    validateFields((errors) => {
      if (errors) {
        return
      }
      if (debitTotal !== creditTotal) {
        message.error('Debit and Credit is not balance')
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.storeId = lstorage.getCurrentUserStore()
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

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleModalShowList = (record) => {
    modalShowList(record)
  }

  const listDetailOpts = {
    handleModalShowList,
    listItem,
    listAccountCode,
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
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input maxLength={255} autoFocus />)}
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
          <Col {...column} />
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
