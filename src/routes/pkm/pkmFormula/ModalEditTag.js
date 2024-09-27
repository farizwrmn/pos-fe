import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Select, Modal } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalEditPkm extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('pkm')
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
      listTag,
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props

    const productTag = (listTag || []).length > 0 ? listTag.map(c => <Option value={c.tagCode} key={c.tagCode} title={c.tagDescription}>{c.tagCode} ({c.tagDescription})</Option>) : []

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const record = {
          ...getFieldsValue(),
          minor: item.minor,
          mpkm: item.mpkm
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
          <Button type="primary" onClick={() => handleOk()}>Submit</Button>
        ]}
      >
        <Form>
          <FormItem label="Tag" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productTag', {
              initialValue: item.productTag,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{productTag}
            </Select>)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalEditPkm.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalEditPkm)
