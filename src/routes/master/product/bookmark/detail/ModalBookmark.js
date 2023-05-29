import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IMAGEURL, rest } from 'utils/config.company'
import { Form, Modal, Input, Button, message, Icon, Upload } from 'antd'

const { apiCompanyURL } = rest
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

class ModalBookmark extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('shortcutCode')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const {
      item,
      onSubmit,
      loading,
      form: { getFieldDecorator, validateFields, getFieldsValue },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) return
        const record = {
          ...getFieldsValue()
        }
        Modal.confirm({
          title: 'Save This Data',
          content: 'Are you sure ?',
          onOk () {
            record.id = item.id
            record.groupId = item.groupId
            record.productId = item.productId
            record.type = item.type
            onSubmit(record)
          }
        })
      })
    }
    const modalOpts = {
      ...modalProps,
      onOk: handleOk
    }
    return (
      <Modal {...modalOpts}
        footer={[
          <Button type="primary" disabled={loading} onClick={handleOk}>Save</Button>
        ]}
      >
        <Form>
          <FormItem label="Shortcut Code" help="input 3 nomor shortcut yang tersedia" hasFeedback {...formItemLayout}>
            {getFieldDecorator('shortcutCode', {
              initialValue: item.shortcutCode,
              rules: [
                {
                  required: false,
                  message: 'Shortcut must be 3 characters',
                  pattern: /^[0-9]{3}$/
                }
              ]
            })(<Input maxLength={10} placeholder="Shortcut Code" />)}
          </FormItem>

          <FormItem
            label="Bookmark Image"
            help="Only accept single jpg or png file, max: 2mb"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('bookmarkImage', {
              initialValue: item && item.bookmarkImage
                ? {
                  fileList: [
                    {
                      uid: 1,
                      name: item.bookmarkImage,
                      status: 'done',
                      url: `${IMAGEURL}/${item.bookmarkImage}`,
                      thumbUrl: `${IMAGEURL}/${item.bookmarkImage}`
                    }
                  ]
                }
                : null,
              valuePropName: 'file',
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Upload
                {...this.props}
                multiple={false}
                showUploadList={{
                  showPreviewIcon: true
                }}
                defaultFileList={item && item.bookmarkImage
                  ? [
                    {
                      uid: 1,
                      name: item.bookmarkImage,
                      status: 'done',
                      url: `${IMAGEURL}/${item.bookmarkImage}`,
                      thumbUrl: `${IMAGEURL}/${item.bookmarkImage}`
                    }
                  ]
                  : []}
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
                  <Icon type="upload" />
                  Click to choice image
                </Button>
              </Upload>
            )}
            {item.bookmarkImage && (
              <img src={`${IMAGEURL}/${item.bookmarkImage}`} alt="" width="100" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ModalBookmark.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalBookmark)
