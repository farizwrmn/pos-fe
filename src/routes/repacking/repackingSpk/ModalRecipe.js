import React, { Component } from 'react'
import { Modal, Form, Select, Spin, InputNumber } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

class ModalMemberTier extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('productCode')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      item,
      modalType,
      fetching,
      listProduct,
      childrenProduct = listProduct && listProduct.length > 0 ? listProduct.map(x => (<Option value={x.productCode} key={x.productCode} title={`${x.productName} (${x.productCode})`}>{`${x.productName} (${x.productCode})`}</Option>)) : [],
      showLov,
      form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields,
        resetFields
      },
      ...modalProps
    } = this.props

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            if (modalProps.modalType === 'add') {
              modalProps.onAdd(data, resetFields)
            } else {
              modalProps.onEdit(data, resetFields)
            }
          },
          onCancel () { }
        })
      })
    }

    return (
      <Modal
        {...modalProps}
        onOk={() => handleSubmit()}
      >
        <Form layout="horizontal">
          <FormItem label="Product" hasFeedback {...formItemLayout} >
            {getFieldDecorator('productCode', {
              initialValue: item.productCode,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select
                onSearch={value => showLov('productstock', { q: value })}
                showSearch
                size="large"
                style={{ width: '100%' }}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                placeholder="Choose Product"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenProduct}
              </Select>
            )}
          </FormItem>
          <FormItem label="Qty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('qty', {
              initialValue: item.qty || 1,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={1} max={999999999} style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalMemberTier)
