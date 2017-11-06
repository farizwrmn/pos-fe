import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Row, Col, Upload } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  item = {},
  disableItem,
  onOk,
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

      modalButtonSaveClick(data.brandCode, data)
    })

  }


  return (
    <Modal {...modalOpts}
      footer={[
        <Button key='back'   onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key='submit' onClick={() => hdlButtonSaveClick()} type='primary' >Save</Button>,
      ]}
    >
      <Form layout='horizontal'>
        <FormItem label='Code' hasFeedback {...formItemLayout}>
          {getFieldDecorator('brandCode', {
            initialValue: item.brandCode,
            rules: [{
              required: true,
              pattern: /^[a-z0-9\_]{3,10}$/i,
              message: "a-Z & 0-9"
            }],
          })(<Input disabled={disableItem.code} />)}
        </FormItem>
        <FormItem label='Name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('brandName', {
            initialValue: item.brandName,
            rules: [{required: true, min:3, max: 20}],
          })(<Input />)}
        </FormItem>
        <FormItem label='Image' hasFeedback {...formItemLayout}>
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('brandImage', {
                initialValue: item.brandImage,
                rules: [{max: 50}],
              })(<Input />)}
            </Col>
            <Col span={12}>
              <Upload>
                <Button size="middle">Upload</Button>
              </Upload>
            </Col>
          </Row>
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
}

export default Form.create()(modal)
