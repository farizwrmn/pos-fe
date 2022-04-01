import React from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Upload, message, Modal, Button } from 'antd'
import { lstorage } from 'utils'
import { rest } from 'utils/config.company'

const { apiCompanyURL } = rest
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const ModalApprove = ({
  onOk,
  item = {},
  data,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
  ...modalProps
}) => {
  let defaultRole = (lstorage.getStorageKey('udi')[3] || '')
  const handleOk = () => {
    if (defaultRole === 'CSH') return
    validateFields((errors) => {
      if (errors) return
      const record = {
        id: item ? item.id : '',
        transNo: data ? data.transNo : '',
        storeId: data ? data.storeId : '',
        ...getFieldsValue()
      }
      Modal.confirm({
        title: `Void ${data.transNo}'s payment`,
        content: 'Are you sure ?',
        onOk () {
          onOk(record)
        }
      })
      resetFields()
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }
  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>
      ]}
    >
      <Form>
        <FormItem help="Only 1 Image" label="Bukti Bayar" {...formItemLayout}>
          {getFieldDecorator('image', {
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
      </Form>
    </Modal>
  )
}

ModalApprove.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(ModalApprove)
