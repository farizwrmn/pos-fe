import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Select, Form, InputNumber } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class ModalCommission extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('commissionValue')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 100)
  }

  render () {
    const {
      listOutlet,
      item,
      onOk,
      onCancel,
      form: { resetFields, getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props
    const listOutletOpt = (listOutlet || []).length > 0 ? listOutlet.map(c => <Option value={c.id} title={c.outlet_name}>{c.outlet_name}</Option>) : []
    const handleClick = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          vendorId: item.vendorId,
          ...getFieldsValue()
        }
        onOk(data, resetFields)
      })
    }

    const modalOpts = {
      ...modalProps,
      onCancel,
      onOk: handleClick
    }

    return (
      <Modal
        {...modalOpts}
        footer={[
          <Button key="primary" onClick={() => handleClick()} type="primary" >OK</Button>
        ]}
      >
        <Form>
          <FormItem {...formItemLayout} label="Outlet">
            {getFieldDecorator('outletId', {
              initialValue: item.outletId,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              placeholder="Choose Outlet"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >{listOutletOpt}
            </Select>)}
          </FormItem>
          <FormItem label="Commission (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('commissionValue', {
              initialValue: item.commissionValue || 0,
              rules: [
                {
                  required: true,
                  pattern: /^([0-9]{0,3})$/i,
                  message: 'Commission is Required'
                }
              ]
            })(
              <InputNumber
                min={0}
                max={100}
                step={1}
                style={{ width: '100%' }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleClick()
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

ModalCommission.propTypes = {
  form: PropTypes.isRequired,
  pos: PropTypes.isRequired,
  item: PropTypes.isRequired,
  onDelete: PropTypes.func.isRequired,
  modalPurchaseVisible: PropTypes.isRequired,
  modalType: PropTypes.string.isRequired,
  addModalItem: PropTypes.func.isRequired,
  editModalItem: PropTypes.func.isRequired
}
export default Form.create()(ModalCommission)
