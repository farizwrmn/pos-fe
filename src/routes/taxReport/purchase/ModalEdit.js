import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Modal, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalEdit extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('qty')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      item,
      onOkList,
      onCancel,
      onDeleteItem,
      listPurchaseLatestDetail,
      loadingPurchaseLatest,
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...formEditProps
    } = this.props
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...item,
          ...getFieldsValue()
        }
        if (Number(data.qty) > 0) {
          data.total = data.qty * data.purchasePrice
          onOkList(data)
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
        width="400px"
        title={`${item.product.productCode} - ${item.product.productName}`}
        {...modalOpts}
        onCancel={handleCancel}
        footer={[
          <Button size="large" key="back" onClick={handleCancel}>Cancel</Button>,
          <Button size="large" key="submit" type="primary" onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Qty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('qty', {
              initialValue: item.qty,
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
          <FormItem label="Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('purchasePrice', {
              initialValue: item.qty > 0 ? item.total / item.qty : 0,
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

ModalEdit.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(ModalEdit)
