import React from 'react'
import PropTypes from 'prop-types'
import { IMAGEURL, rest } from 'utils/config.company'
import { Form, Input, Button, Checkbox, Row, Col, message, Upload, Icon, Modal } from 'antd'

const { apiCompanyURL } = rest
const FormItem = Form.Item

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

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  onSubmit,
  onCancel,
  modalType,
  button,
  form: {
    getFieldDecorator,
    validateFields,
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
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('brandCode', {
              initialValue: item.brandCode,
              rules: [
                {
                  required: true,
                  pattern: /^[a-zA-Z0-9_]{3,}$/,
                  message: 'a-Z & 0-9'
                }
              ]
            })(<Input maxLength={10} autoFocus />)}
          </FormItem>
          <FormItem label="Brand Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('brandName', {
              initialValue: item.brandName,
              rules: [
                {
                  required: true,
                  pattern: /^.{3,20}$/,
                  message: 'Brand Name must be between 3 and 20 characters'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Image" {...formItemLayout}>
            {getFieldDecorator('categoryImage', {
              initialValue: item.categoryImage
                && item.categoryImage != null
                && item.categoryImage !== '"no_image.png"'
                && item.categoryImage !== 'no_image.png' ?
                {
                  fileList: JSON.parse(item.categoryImage).map((detail, index) => {
                    return ({
                      uid: index + 1,
                      name: detail,
                      status: 'done',
                      url: `${IMAGEURL}/${detail}`,
                      thumbUrl: `${IMAGEURL}/${detail}`
                    })
                  })
                }
                : item.categoryImage,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Upload
                multiple
                showUploadList={{
                  showPreviewIcon: true
                }}
                listType="picture"
                defaultFileList={
                  item.categoryImage
                    && item.categoryImage != null
                    && item.categoryImage !== '"no_image.png"'
                    && item.categoryImage !== 'no_image.png' ?
                    JSON.parse(item.categoryImage).map((detail, index) => {
                      return ({
                        uid: index + 1,
                        name: detail,
                        status: 'done',
                        url: `${IMAGEURL}/${detail}`,
                        thumbUrl: `${IMAGEURL}/${detail}`
                      })
                    })
                    : []
                }
                action={`${apiCompanyURL}/time/time`}
                onPreview={file => console.log('file', file)}
                onChange={(info) => {
                  if (info.file.status !== 'uploading') {
                    console.log('pending', info.fileList)
                  }
                  if (info.file.status === 'done') {
                    console.log('success', info)
                    message.success(`${info.file.name} file staged success`)
                  } else if (info.file.status === 'error') {
                    console.log('error', info)
                    message.error(`${info.file.name} file staged failed.`)
                  }
                }}
              >
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="Status" {...formItemLayout}>
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: item.active === undefined ? true : item.active
            })(<Checkbox>Active</Checkbox>)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
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
