import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select, Form, Input, Button, Row, Col, Modal, Card, message, Popover, BackTop } from 'antd'
import { FooterToolbar } from 'components'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select
const FormItem = Form.Item

const confirm = Modal.confirm

const formItemLayout = {
  style: {
    marginTop: 8
  },
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 }
  }
}

const column = {
  md: { span: 24 },
  lg: { span: 12 }
}

class AdvancedForm extends Component {
  render () {
    const {
      onSubmit,
      onCancel,
      listAllStores,
      loadingButton,
      modalType,
      button,
      currentItem,
      // modalSwitchChange,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields
      }
    } = this.props

    const tailFormItemLayout = {
      wrapperCol: {
        span: 24,
        xs: {
          offset: modalType === 'edit' ? 10 : 18
        },
        sm: {
          offset: modalType === 'edit' ? 17 : 22
        },
        md: {
          offset: modalType === 'edit' ? 18 : 22
        },
        lg: {
          offset: modalType === 'edit' ? 11 : 19
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
          id: currentItem.id,
          ...getFieldsValue()
        }
        if (modalType === 'edit') {
          data.viewAt = null
          data.viewBy = null
        }
        if (modalType === 'edit' && !currentItem.id) {
          message.warning('Data cannot be updated. Try to click edit button in browse tab again')
          return
        }
        if (!data.storeId && !currentItem.storeId) {
          message.warning('Must Choose storeId')
          return
        }
        if (!data.name && !currentItem.name) {
          message.warning('Must entry name of planogram. contoh: Planogram [Product Category] [DATE]')
          return
        }
        if (!data.url && !currentItem.url) {
          message.warning('Must Choose URL')
          return
        }
        confirm({
          title: 'Do you want to save?',
          onOk () {
            onSubmit(data.id, data, resetFields)
          },
          onCancel () { }
        })
      })
    }

    // const hdlSwitchChange = (checked) => {
    //   if (checked) {
    //     modalSwitchChange(false)
    //   } else {
    //     modalSwitchChange(true)
    //   }
    // }

    const cardProps = {
      bordered: true,
      style: {
        padding: 8,
        marginLeft: 8,
        marginBottom: 8
      }
    }
    const listStore = listAllStores && listAllStores.length > 0 && listAllStores.map(x => (<Option title={x.storeName} value={x.id} key={x.id}>{x.storeName}</Option>))
    return (
      <Form layout="horizontal">
        <FooterToolbar>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button disabled={loadingButton && (loadingButton.effects['planogram/add'] || loadingButton.effects['planogram/edit'])} type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" disabled={loadingButton && (loadingButton.effects['planogram/add'] || loadingButton.effects['planogram/edit'])} onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </FooterToolbar>
        <Card {...cardProps}>
          <BackTop visibilityHeight={10} />
          <Row>
            <Col {...column}>
              <Popover trigger="hover" open placement="topLeft" content={(<h5> message: contoh: Planogram Product Cipher 2023-11-10</h5>)}>
                <FormItem label="Name" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: currentItem.name || `Planogram [Product Category] ${moment().format('YYYY-MM-DD')}`,
                    rules: [{
                      required: true,
                      message: 'contoh: Planogram Product Cipher 2023-11-10'
                    }]
                  })(
                    <Input placeholder="Planogram [Product Category] [DATE]" />
                  )}
                </FormItem>
              </Popover>
              {modalType === 'edit' ? (
                <FormItem label="Store" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('storeId', {
                    initialValue: currentItem.storeId,
                    rules: [{
                      required: true
                    }]
                  })(
                    <Input value={currentItem.storeId} disabled />
                  )}
                </FormItem>
              )
                : (
                  <FormItem label="Store" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('storeId', {
                      initialValue: currentItem.storeId,
                      rules: [{
                        required: true
                      }]
                    })(
                      <Select
                        showSearch
                        mode="default"
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Choose Store"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {listStore}
                      </Select>
                    )}
                  </FormItem>
                )}
              <FormItem label="View At" hasFeedback {...formItemLayout}>
                {getFieldDecorator('viewAt', {
                  initialValue: currentItem.viewAt
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="View By" hasFeedback {...formItemLayout}>
                {getFieldDecorator('viewBy', {
                  initialValue: currentItem.viewBy
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="URL" hasFeedback {...formItemLayout}>
                {getFieldDecorator('url', {
                  initialValue: currentItem.url,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<TextArea autosize={{ minRows: 2, maxRows: 10 }} />)}
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form >
    )
  }
}


AdvancedForm.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  modalType: PropTypes.string,
  currentItem: PropTypes.object,
  listCategory: PropTypes.object,
  listBrand: PropTypes.object,
  onSubmit: PropTypes.func,
  showBrands: PropTypes.func,
  showCategories: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(AdvancedForm)
