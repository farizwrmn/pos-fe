import React from 'react'
import { Form, Input, Icon, Button, Select, message } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

let uuid = 1
class DynamicFieldSet extends React.Component {
  remove = (k) => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  add = () => {
    const { form, options } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(uuid)
    if (nextKeys.length > options.length) {
      message.warning(`you only have ${options.length} options`)
      return
    }
    uuid += 1
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const formData = form.getFieldsValue()
    // let data = []
    for (let id = 0; id < keys.length; id += 1) {
      console.log('keys', formData)
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { options } = this.props
    const formItemLayoutWithOutLabel = {
      wrapperCol: { span: 24 }
    }
    getFieldDecorator('keys', { initialValue: [0] })
    let Opts = options.map(list => <Option value={list.typeCode}>{list.typeName}</Option>)
    const prefixSelector = (key) => {
      return getFieldDecorator(`method[${key}]`, {
        initialValue: Opts.length > 0 ? Opts[0].props.value : null
      })(
        <Select style={{ width: 100 }}>
          {Opts}
        </Select>
      )
    }
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayoutWithOutLabel}
          label={index === 0 ? 'Payment Method' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              pattern: /^([0-9]{0,19})$/i,
              message: 'Please input amount or delete this field.'
            }]
          })(<Input maxLength={19} autoFocus addonBefore={prefixSelector(k)} placeholder="Payment Amount" style={{ width: '60%', marginRight: 8 }} />)}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      )
    })
    let isCtrl = false
    const perfect = () => {
      this.add()
    }
    document.onkeyup = function (e) {
      if (e.which === 17) isCtrl = false
    }
    document.onkeydown = function (e) {
      if (e.which === 17) isCtrl = true
      if (e.which === 66 && isCtrl === true && window.location.pathname === '/transaction/pos/payment') {
        perfect()
        return false
      }
    }
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button icon="plus" type="dashed" onClick={this.add} style={{ width: '60%' }}>
            Add Method (Ctrl + B)
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(DynamicFieldSet)
