import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputNumber, Select, Modal } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalEditProduct extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('qty')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }
  render () {
    const {
      onOk,
      item = {},
      listReason,
      listProductProps,
      onDeleteItem,
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props

    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0

    const reasonData = listReason && listReason.map(item => (<Option value={item.paramValue}>{item.paramValue}</Option>))

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const record = {
          ...getFieldsValue()
        }
        onOk(record)
      })
    }

    return (
      <Modal
        width={400}
        {...modalProps}
        title={`${item.productCode} - ${item.productName}`}
        footer={[
          <Button type="danger" onClick={() => onDeleteItem()} style={{ float: 'left' }}>Delete</Button>,
          <Button type="primary" onClick={() => handleOk()}>Submit</Button>
        ]}
      >
        <Form>
          <FormItem label="Qty" {...formItemLayout}>
            {getFieldDecorator('qty', {
              initialValue: item.qty,
              rules: [
                {
                  required: true,
                  message: 'At least 1 character'
                }
              ]
            })(<InputNumber
              min={0}
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13) {
                    handleOk()
                  }
                }
              }
            />)}
          </FormItem>
          <FormItem label="Description" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: false
                }
              ]
            })(<Select
              style={{ width: '100%' }}
              showSearch
              filterOption={filterOption}
            >
              {reasonData}
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalEditProduct.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEditProduct)
