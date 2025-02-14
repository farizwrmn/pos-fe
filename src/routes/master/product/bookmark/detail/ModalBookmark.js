import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IMAGEURL, rest } from 'utils/config.company'
import { Form, Modal, Input, Row, Col, Select, TimePicker, DatePicker, Button, message, Icon, Upload } from 'antd'
import moment from 'moment'

const { apiCompanyURL } = rest
const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker

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
      listAllStores = [],
      form: { getFieldDecorator, validateFields, getFieldsValue, getFieldValue },
      ...modalProps
    } = this.props

    const handleOk = () => {
      validateFields((errors) => {
        if (errors) return
        const record = {
          ...getFieldsValue()
        }
        record.startDate = (record.Date || []).length > 0 ? moment(record.Date[0]).format('YYYY-MM-DD') : null
        record.endDate = (record.Date || []).length > 0 ? moment(record.Date[1]).format('YYYY-MM-DD') : null
        record.availableDate = (record.availableDate || []).length > 0 ? record.availableDate.toString() : null
        record.availableStore = (record.availableStore || []).length > 0 ? record.availableStore.toString() : null
        record.startHour = record.startHour ? moment(record.startHour).format('HH:mm') : null
        record.endHour = record.endHour ? moment(record.endHour).format('HH:mm') : null
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

    const disabledDate = (current) => {
      // Can not select days before today and today
      return current && current < moment().startOf('day')
    }

    let childrenStore = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

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
          <FormItem label="Available Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('Date', {
              initialValue: item.startDate ? [
                moment(item.startDate),
                moment(item.endDate)
              ] : null,
              rules: [
                {
                  required: true
                }
              ]
            })(<RangePicker disabledDate={disabledDate} allowClear />)}
          </FormItem>
          <FormItem label="Available Hour" hasFeedback {...formItemLayout}>
            <Row gutter={12}>
              <Col span={12}>
                {getFieldDecorator('startHour', {
                  initialValue: item.startHour ? moment(item.startHour, 'HH:mm') : moment('00:00', 'HH:mm'),
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<TimePicker defaultValue={moment('00:00', 'HH:mm')} style={{ width: '100%' }} allowClear format={'HH:mm'} />)}
              </Col>
              <Col span={12}>
                {getFieldDecorator('endHour', {
                  initialValue: item.endHour ? moment(item.endHour, 'HH:mm') : moment('23:59', 'HH:mm'),
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<TimePicker defaultValue={moment('23:59', 'HH:mm')} style={{ width: '100%' }} allowClear format={'HH:mm'} />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem
            label="Available Days"
            hasFeedback
            help={(getFieldValue('availableDate') || '').length > 0 ? `${(getFieldValue('availableDate') || '').length} ${(getFieldValue('availableDate') || '').length === 1 ? 'day' : 'days'}` : 'clear it if available every day'}
            {...formItemLayout}
          >
            {getFieldDecorator('availableDate', {
              initialValue: item.availableDate ? (item.availableDate || '').split(',') : [],
              rules: [
                {
                  required: false
                }
              ]
            })(<Select style={{ width: '100%' }} mode="multiple" allowClear size="large">
              <Option value="1">Monday</Option>
              <Option value="2">Tuesday</Option>
              <Option value="3">Wednesday</Option>
              <Option value="4">Thursday</Option>
              <Option value="5">Friday</Option>
              <Option value="6">Saturday</Option>
              <Option value="7">Sunday</Option>
            </Select>)}
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
