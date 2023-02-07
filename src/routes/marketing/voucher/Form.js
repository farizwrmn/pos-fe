import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, Input, InputNumber, Button, Checkbox,
  Select, DatePicker,
  // Upload, message, Icon,
  Row, Col, Modal
} from 'antd'
import moment from 'moment'
// import { IMAGEURL, rest } from 'utils/config.company'

const { TextArea } = Input
const FormItem = Form.Item
const { Option } = Select
// const { apiCompanyURL } = rest

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
  newTransNo,
  disableButton,
  onSubmit,
  onCancel,
  modalType,
  listAccountCode,
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
  // ...props
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : []
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

  function disabledDate (current) {
    // Can not select days before today and today
    return current && current.valueOf() < Date.now()
  }

  return (
    <Form layout="horizontal">
      <h1>General Info</h1>
      <Row>
        <Col {...column}>
          <FormItem label="Voucher Code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('voucherCode', {
              initialValue: modalType === 'edit' ? item.voucherCode : newTransNo,
              rules: [
                {
                  required: true,
                  pattern: /^[a-z0-9-/]{3,50}$/i
                }
              ]
            })(<Input disabled maxLength={50} />)}
          </FormItem>
          <FormItem label="Voucher Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('voucherName', {
              initialValue: item.voucherName,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={50} autoFocus />)}
          </FormItem>
          <FormItem label="Voucher Value" help="Price charge when customer use the voucher" hasFeedback {...formItemLayout}>
            {getFieldDecorator('voucherValue', {
              initialValue: modalType === 'add' ? 10000 : item.voucherValue,
              rules: [
                {
                  pattern: /^[0-9/]{1,50}$/i,
                  required: true
                }
              ]
            })(<InputNumber defaultValue={10000} disabled={modalType === 'edit' ? item.soldOne : false} style={{ width: '100%' }} min={10000} />)}
          </FormItem>
          <FormItem label="Voucher Price" help="Price charge when customer buy the voucher" hasFeedback {...formItemLayout}>
            {getFieldDecorator('voucherPrice', {
              initialValue: modalType === 'add' ? 10000 : item.voucherPrice,
              rules: [
                {
                  pattern: /^[0-9/]{1,50}$/i,
                  required: true
                }
              ]
            })(<InputNumber defaultValue={10000} disabled={modalType === 'edit' ? item.soldOne : false} style={{ width: '100%' }} min={0} />)}
          </FormItem>
          <FormItem label="Voucher Quantity" hasFeedback {...formItemLayout}>
            {getFieldDecorator('voucherCount', {
              initialValue: modalType === 'add' ? 1 : item.voucherCount,
              rules: [
                {
                  pattern: /^[0-9/]{1,50}$/i,
                  required: true
                }
              ]
            })(<InputNumber disabled={modalType === 'edit'} min={1} max={9999} />)}
          </FormItem>
          {/* <FormItem label="Image" {...formItemLayout}>
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
                : []
            })(
              <Upload
                {...props}
                multiple
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
          </FormItem> */}
        </Col>
      </Row>
      <h1>Advanced Option</h1>
      <Row>
        <Col {...column}>
          <FormItem label="Expire Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expireDate', {
              initialValue: item.expireDate ? moment(item.expireDate) : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker disabled={modalType === 'edit'} showToday={false} disabledDate={disabledDate} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="OverPay / Expired Revenue">
            {getFieldDecorator('accountId', {
              initialValue: item.accountId,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              disabled={modalType === 'edit'}
              optionFilterProp="children"
              filterOption={filterOption}
            >{listAccountOpt}
            </Select>)}
          </FormItem>
          <FormItem label="Description" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: true
                }
              ]
            })(<TextArea maxLength={65535} autosize={{ minRows: 2, maxRows: 10 }} />)}
          </FormItem>
          <FormItem label="Status" {...formItemLayout}>
            {getFieldDecorator('active', {
              valuePropName: 'checked',
              initialValue: item.active === undefined ? true : item.active
            })(<Checkbox>Active</Checkbox>)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" disabled={disableButton} onClick={handleSubmit}>{button}</Button>
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
