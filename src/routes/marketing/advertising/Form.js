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
  listAllStores,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
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
      data.availableStore = (data.availableStore || []).length > 0 ? data.availableStore.toString() : null
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  let childrenStore = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

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
            {getFieldDecorator('typeAds', {
              initialValue: item.typeAds,
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
            {getFieldDecorator('sort', {
              initialValue: item.sort == null ? 10 : item.sort,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber min={1} max={10} />)}
          </FormItem>
          <FormItem label="Width" hasFeedback {...formItemLayout}>
            {getFieldDecorator('width', {
              initialValue: modalType === 'add' ? 'auto' : item.width,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Height" hasFeedback {...formItemLayout}>
            {getFieldDecorator('height', {
              initialValue: modalType === 'add' ? '100px' : item.height,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem help="Only 1 Image" label="Image" {...formItemLayout}>
            {getFieldDecorator('image', {
              initialValue: item.image
                && item.image != null
                && item.image !== '["no_image.png"]'
                && item.image !== '"no_image.png"'
                && item.image !== 'no_image.png' ?
                {
                  fileList: [
                    {
                      uid: 1,
                      name: item.image,
                      status: 'done',
                      url: `${IMAGEURL}/${item.image}`,
                      thumbUrl: `${IMAGEURL}/${item.image}`
                    }
                  ]
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
                defaultFileList={item.image
                  && item.image != null
                  && item.image !== '["no_image.png"]'
                  && item.image !== '"no_image.png"' ?
                  [
                    {
                      uid: 1,
                      name: item.image,
                      status: 'done',
                      url: `${IMAGEURL}/${item.image}`,
                      thumbUrl: `${IMAGEURL}/${item.image}`
                    }
                  ]
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
          <FormItem
            label="Store"
            hasFeedback
            help={(getFieldValue('availableStore') || '').length > 0 ? `${(getFieldValue('availableStore') || '').length} ${(getFieldValue('availableStore') || '').length === 1 ? 'store' : 'stores'}` : 'clear it if available all stores'}
            {...formItemLayout}
          >
            {getFieldDecorator('availableStore', {
              initialValue: item.availableStore ? (item.availableStore || '').split(',') : []
            })(
              <Select
                mode="multiple"
                allowClear
                size="large"
                style={{ width: '100%' }}
                placeholder="Choose Store"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenStore}
              </Select>
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
