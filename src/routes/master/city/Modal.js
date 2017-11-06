import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button} from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item = {},
  onOk,
  visiblePopover = false,
  disabledItem = { userId: true, getEmployee: true },
  modalButtonCancelClick,
  modalButtonSaveClick,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.userRole = data.userRole.join(' ')
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const hdlButtonCancelClick = () => {
    modalButtonCancelClick()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      modalButtonSaveClick(data)
    })
  }

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key="submit" onClick={() => hdlButtonSaveClick()} type="primary" >Save</Button>,
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Code" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cityCode', {
            initialValue: item.cityCode,
            rules: [{
              required: true,
              pattern: /^[a-z0-9\_]{3,10}$/i,
              message: "a-Z & 0-9"
            }],
          })(<Input maxLength={10} />)}
        </FormItem>
        <FormItem label="City Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cityName', {
            initialValue: item.cityName,
            rules: [{
              required: true,
              pattern: /^([a-zA-Z ]{0,25})$/,
              message: "a-Z & 0-9"
            }],
          })(<Input maxLength={25} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func,
}

export default Form.create()(modal)
