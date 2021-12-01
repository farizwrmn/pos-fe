import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, InputNumber, Icon, message, Upload, Button, Row, Col, Modal } from 'antd'
import { IMAGEURL, rest } from 'utils/config.company'

const { apiCompanyURL } = rest
const { Option } = Select

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
          <FormItem label="Advertising Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} />)}
          </FormItem>
          <FormItem label="Advertising Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: item.type,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select>
                <Option value="CUSTVIEW">Customer View</Option>
                <Option value="CASHIER">Cashier View</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="Sort" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.sort == null ? item.sort : 10,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={1} max={10} />)}
          </FormItem>
          <FormItem help="Only 1 Image" label="Image" {...formItemLayout}>
            {getFieldDecorator('productImage', {
              initialValue: item.productImage
                && item.productImage != null
                && item.productImage !== '["no_image.png"]'
                && item.productImage !== '"no_image.png"'
                && item.productImage !== 'no_image.png' ?
                {
                  fileList: JSON.parse(item.productImage).map((detail, index) => {
                    return ({
                      uid: index + 1,
                      name: detail,
                      status: 'done',
                      url: `${IMAGEURL}/${detail}`,
                      thumbUrl: `${IMAGEURL}/${detail}`
                    })
                  })
                }
                : [],
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Upload
                showUploadList={{
                  showPreviewIcon: true
                }}
                defaultFileList={item.productImage
                  && item.productImage != null
                  && item.productImage !== '["no_image.png"]'
                  && item.productImage !== '"no_image.png"'
                  && item.productImage !== 'no_image.png' ?
                  JSON.parse(item.productImage).map((detail, index) => {
                    return ({
                      uid: index + 1,
                      name: detail,
                      status: 'done',
                      url: `${IMAGEURL}/${detail}`,
                      thumbUrl: `${IMAGEURL}/${detail}`
                    })
                  })
                  : []}
                listType="picture"
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
