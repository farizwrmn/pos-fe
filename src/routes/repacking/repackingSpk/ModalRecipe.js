import React, { Component } from 'react'
import { Modal, Form, Select, Spin, Button, message, InputNumber } from 'antd'

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
      loading,
      onDelete,
      form: {
        getFieldDecorator,
        getFieldValue,
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
            if (data.minQty > data.qty) {
              message.error('Min Qty is more than Qty')
              return
            }
            if (data.maxQty < data.qty) {
              message.error('Max Qty is more than Qty')
              return
            }
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

    const handleDelete = () => {
      Modal.confirm({
        title: 'Delete this item',
        content: 'Are you sure ?',
        onOk () {
          onDelete(item.productCode)
        }
      })
    }

    return (
      <Modal
        {...modalProps}
        onOk={() => handleSubmit()}
        footer={[
          <span>{modalType === 'edit' && <Button disabled={loading} size="large" key="delete" type="danger" style={{ margin: '0 10px' }} onClick={handleDelete}>Delete</Button>}</span>,
          <Button disabled={loading} size="large" key="back" onClick={modalProps.onCancel}>Cancel</Button>,
          <Button disabled={loading} size="large" key="submit" type="primary" onClick={() => handleSubmit()}>Ok</Button>
        ]}
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

          <FormItem label="Min Qty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('minQty', {
              initialValue: ((getFieldValue('qty') || 0)) || 1,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={1} max={999999999} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem label="Max Qty" hasFeedback {...formItemLayout}>
            {getFieldDecorator('maxQty', {
              initialValue: ((getFieldValue('qty') || 0)) || 1,
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
