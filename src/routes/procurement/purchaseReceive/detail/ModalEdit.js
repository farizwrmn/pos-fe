import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class TransferModal extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('receivedQty')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      currentItemList,
      item,
      onCancel,
      onOk,
      onDeleteItem,
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...formEditProps
    } = this.props
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...currentItemList,
          ...getFieldsValue()
        }
        if (Number(data.qty) > 0) {
          onOk(data)
        } else {
          Modal.warning({
            title: 'Message Error',
            content: 'Qty must greater than zero!'
          })
        }
      })
    }
    const handleCancel = () => {
      onCancel()
    }
    const modalOpts = {
      ...formEditProps,
      onOk: handleOk
    }

    return (
      <Modal
        onCancel={onCancel}
        title={`${currentItemList.product.productCode} - ${currentItemList.product.productName}`}
        {...modalOpts}
        footer={[
          <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="No" hasFeedback {...formItemLayout}>
            {getFieldDecorator('no', {
              initialValue: currentItemList.no,
              rules: [{
                required: true
              }]
            })(<Input disabled maxLength={10} />)}
          </FormItem>
          <FormItem label="Received" hasFeedback {...formItemLayout}>
            {getFieldDecorator('receivedQty', {
              initialValue: currentItemList.receivedQty || currentItemList.qty,
              rules: [{
                required: true
              }]
            })(
              <InputNumber
                value={0}
                min={0}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleOk()
                  }
                }}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

TransferModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(TransferModal)
