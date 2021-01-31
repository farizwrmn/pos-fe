import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Form, InputNumber, Button } from 'antd'
import { numberFormatter } from 'utils/string'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class ModalList extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('chargePercent')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      addModalItem,
      editModalItem,
      deleteModalItem,
      listAccountCode,
      onDelete,
      showLov,
      item,
      modalItemType,
      modalType,
      form: { resetFields, getFieldDecorator, validateFields, getFieldsValue, getFieldValue },
      ...modalProps
    } = this.props

    const handleClick = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...item,
          ...getFieldsValue()
        }
        data.no = item.no
        editModalItem(data)
        resetFields()
      })
    }

    const modalOpts = {
      ...modalProps,
      onOk: handleClick
    }

    const total = item && item.id ?
      (parseFloat(item.amount) * (1 + (parseFloat(getFieldValue('chargePercent')) / 100))) + parseFloat(getFieldValue('chargeNominal'))
      : 0

    return (
      <Modal {...modalOpts}
        footer={[
          <Button size="large" key="delete" type="danger" onClick={() => deleteModalItem(item.no)} disabled={modalType === 'edit'}>Delete</Button>,
          <Button size="large" key="back" onClick={() => modalProps.onCancel()}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleClick}>{total > 0 ? `Ok (${numberFormatter(parseInt(total, 10))})` : 'Ok'}</Button>
        ]}
      >
        <Form>
          <FormItem {...formItemLayout} label="Total">
            {getFieldDecorator('amount', {
              initialValue: item.amount != null ? item.amount : 0,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,19})$/i,
                message: 'Total is not define'
              }]
            })(<InputNumber
              min={0}
              max={9999999999}
              disabled
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleClick()
                }
              }}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Charge Percent">
            {getFieldDecorator('chargePercent', {
              initialValue: item.chargePercent != null ? item.chargePercent : 0,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,19})$/i,
                message: 'Charge Percent is not define'
              }]
            })(<InputNumber
              min={0}
              max={100}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleClick()
                }
              }}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Charge Nominal">
            {getFieldDecorator('chargeNominal', {
              initialValue: item.chargeNominal != null ? item.chargeNominal : 0,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,19})$/i,
                message: 'Charge Nominal is not define'
              }]
            })(<InputNumber
              min={0}
              max={9999999999}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleClick()
                }
              }}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Memo">
            {getFieldDecorator('memo', {
              initialValue: item.memo
            })(<Input
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  handleClick()
                }
              }}
            />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalList.propTypes = {
  form: PropTypes.isRequired,
  pos: PropTypes.isRequired,
  item: PropTypes.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalPurchaseVisible: PropTypes.isRequired,
  modalType: PropTypes.string.isRequired,
  addModalItem: PropTypes.func.isRequired,
  editModalItem: PropTypes.func.isRequired
}
export default Form.create()(ModalList)
