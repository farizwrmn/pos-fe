import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, InputNumber, Button } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalEntry extends Component {
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
      onOk,
      item = {},
      data,
      detailData,
      form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) return
        const record = {
          userId: 1,
          transId: detailData ? detailData.id : '',
          batchId: detailData ? detailData.batchId : '',
          storeId: detailData ? detailData.storeId : '',
          productCode: item.productCode,
          ...getFieldsValue()
        }
        onOk(record, resetFields)
      })
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }
    return (
      <Modal {...modalOpts}
        footer={[
          <Button key="submit" onClick={() => handleOk()} type="primary" >Finish</Button>
        ]}
      >
        <Form>
          <FormItem {...formItemLayout} label="Qty">
            {getFieldDecorator('Qty', {
              initialValue: item.qty,
              rules: [{
                required: true,
                pattern: /^([0-9.]{0,5})$/i,
                message: 'Qty is not required'
              }]
            })(<InputNumber

              min={0}
              max={99999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalEntry.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEntry)
