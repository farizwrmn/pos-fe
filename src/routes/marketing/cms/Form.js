import React from 'react'
import PropTypes from 'prop-types'
import { Select, message, Form, Input, Button, Row, Col, Modal, Upload, Icon } from 'antd'
import { Editor } from 'components'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    sm: { span: 16 },
    md: { span: 17 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 18 },
  xl: { span: 18 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  loadingButton,
  button,
  onChangeBody,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
    getFieldsValue,
    resetFields
  }
}) => {
  const tailFormItemLayout = {
    wrapperCol: {
      span: 24,
      xs: {
        offset: modalType === 'edit' ? 10 : 19
      },
      sm: {
        offset: modalType === 'edit' ? 15 : 20
      },
      md: {
        offset: modalType === 'edit' ? 15 : 19
      },
      lg: {
        offset: modalType === 'edit' ? 13 : 18
      }
    }
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      // data.files = data.files.fileList.slice(-1)[0]
      data.body = item.body ? item.body : null
      data.files = data.files ? data.files.file : null

      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          resetFields()
        },
        onCancel () { }
      })
    })
  }
  const beforeUpload = (file) => {
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')
    if (!isJPG) {
      message.error('You can only upload JPG or PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return false
  }

  const handleChangeBody = (value) => {
    onChangeBody(value)
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Title" hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: item.title,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={60} autoFocus />)}
          </FormItem>
          <FormItem label="Body" hasFeedback {...formItemLayout}>
            <Editor value={item.body || ''} onChange={handleChangeBody} />
          </FormItem>
          <FormItem label="Status" hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: item.status || '1',
              rules: [
                {
                  required: true
                }
              ]
            })(<Select>
              <Option key="1" value="1">Publish</Option>
              <Option key="2" value="2">Pending</Option>
              <Option key="3" value="3">Non-active</Option>
            </Select>)}
          </FormItem>
          <FormItem label="Image" hasFeedback {...formItemLayout}>
            {getFieldDecorator('files', {
              rules: [
                {
                  required: !!getFieldValue('files') || !item.image
                }
              ]
            })(<Upload
              multiple={false}
              beforeUpload={beforeUpload}
            >
              <Button>
                <Icon type="plus" /> Click to Upload
              </Button>
            </Upload>)}
            {!getFieldValue('files') && item.image && <img src={item.image} alt="" width="100" />}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" disabled={loadingButton.effects['cms/edit']} style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button disabled={loadingButton.effects['cms/add'] || loadingButton.effects['cms/edit']} type="primary" onClick={handleSubmit}>{loadingButton.effects['cms/add'] || loadingButton.effects['cms/edit'] ? 'Loading...' : button}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
