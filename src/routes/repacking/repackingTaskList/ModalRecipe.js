import React, { Component } from 'react'
import { Modal, Form, Input, Button, Row, Col, InputNumber } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    md: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 16 },
    md: { span: 14 }
  }
}

class ModalMemberTier extends Component {
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
      modalType,
      loading,
      material,
      onDelete,
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
          ...item,
          ...getFieldsValue()
        }
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            let material = []
            for (let key in data.material) {
              if (data.material[key]) {
                material.push({
                  id: key,
                  qty: data.material[key]
                })
              }
            }
            const request = {
              id: item.id,
              qty: data.qty,
              material
            }
            modalProps.onEdit(request, resetFields)
          },
          onCancel () { }
        })
      })
    }

    const listMaterial = material ? material.filter(filtered => filtered.detailRequestId === item.id) : []

    return (
      <Modal
        {...modalProps}
        width={700}
        onOk={() => handleSubmit()}
        footer={[
          <Button disabled={loading} size="large" key="back" onClick={modalProps.onCancel}>Cancel</Button>,
          <Button disabled={loading} size="large" key="submit" type="primary" onClick={() => handleSubmit()}>Ok</Button>
        ]}
      >
        <Form layout="horizontal">
          <FormItem label="Product" hasFeedback {...formItemLayout} >
            {getFieldDecorator('productName', {
              initialValue: item.productName,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="Qty Hasil" hasFeedback {...formItemLayout} >
            {getFieldDecorator('qty', {
              initialValue: item.qty,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber min={0} />
            )}
          </FormItem>
          <br />
          <Row>
            <Col span={10} />
            <Col span={14}>
              <h4>Penggunaan Bahan</h4>
            </Col>
          </Row>
          <br />
          {listMaterial && listMaterial.map(item => (
            <FormItem label={`${item.qty} x ${item.productName}`} hasFeedback {...formItemLayout} >
              {getFieldDecorator(`material["${item.id}"]`, {
                initialValue: item.qty,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <InputNumber min={0} disabled />
              )}
            </FormItem>
          ))}
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalMemberTier)
