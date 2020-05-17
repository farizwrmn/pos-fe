import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Button } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class TransferModal extends Component {
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
      currentItemList,
      onOkList,
      onCancelList,
      onDeleteItem,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      ...formEditProps
    } = this.props
    const { handleProductBrowse } = formEditProps.modalProductProps
    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }

        const data = {
          ...getFieldsValue()
        }
        if (Number(data.qty) > 0) {
          data.transType = currentItemList.transType
          data.description = (data.description === '' || data.description === null ? null : data.description)
          data.productId = currentItemList.productId
          data.productCode = currentItemList.productCode
          data.productName = currentItemList.productName
          onOkList(data)
          handleProductBrowse()
        } else {
          Modal.warning({
            title: 'No available quantity',
            content: 'Price must greater than zero!'
          })
        }
      })
    }
    const handleCancel = () => {
      onCancelList()
    }
    const handleDelete = () => {
      const data = {
        transType: currentItemList.transType,
        ...getFieldsValue()
      }
      Modal.confirm({
        title: `Delete ${currentItemList.productName}`,
        content: 'Are you sure ?',
        onOk () {
          onDeleteItem(data.no - 1)
          resetFields()
        }
      })
    }
    const modalOpts = {
      ...formEditProps,
      onOk: handleOk
    }
    return (
      <Modal title={`${currentItemList.productCode} - ${currentItemList.productName}`}
        {...modalOpts}
        footer={[
          <Button size="large" key="delete" type="danger" onClick={handleDelete}>Delete</Button>,
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
          <FormItem label="Qty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('qty', {
              initialValue: currentItemList.qty,
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
          <FormItem label="Description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: currentItemList.description,
              rules: [{
                required: false
              }]
            })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 6 }} />)}
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
