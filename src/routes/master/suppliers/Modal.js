import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Icon, Modal, Cascader, Checkbox, Button, Row, Col, Popover, Table, Collapse } from 'antd'
import BrowseCity from './BrowseCity'

const FormItem = Form.Item
const Panel = Collapse.Panel

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}
const modal = ({
  item = {},
  onOk,
  listCity,
  onChooseCity,
  visiblePopoverCity = false,
  disabledItem = { userId: true, getEmployee: true },
  modalPopoverVisible,
  modalPopoverClose,
  modalIsEmployeeChange,
  modalPopoverVisibleCity,
  modalButtonCityClick,
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
      onOk(data)
    })
  }

  const hdlTableCityRowClick = (record) => {
    onChooseCity(record)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }



  const hdlTableRowClick = (record) => {
    onChooseItem(record)
  }

  const hdlButtonCityClick = () => {
    modalButtonCityClick()
  }
  const hdlPopoverVisibleCityChange = () => {
    modalPopoverVisibleCity()
  }

  const hdlPopoverVisibleChange = () => {
    modalPopoverVisible()
  }

  const hdlPopoverClose = () => {
    modalPopoverClose()
  }

  const hdlCheckboxChange = (e) => {
    modalIsEmployeeChange(e.target.checked)
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
      modalButtonSaveClick(data)
    })
  }
  const hdlCheckPassword = (rule, value, callback) => {
    const fieldPassword = getFieldsValue(['password'])
    if (value && value !== fieldPassword.password) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }
  const hdlCheckConfirm = (rule, value, callback) => {
    if (value) {
      validateFields(['confirm'], { force: true })
    }
    callback()
  }
  const titlePopover = (
    <Row>
      <Col span={8}>Choose</Col>
      <Col span={1} offset={15}>
        <Button shape="circle"
          icon="close-circle"
          size="small"
          onClick={() => hdlPopoverClose()}
        />
      </Col>
    </Row>
  )

  const contentPopoverCity = (
    <div>
      <BrowseCity pagination={false} dataSource={listCity}
      onRowClick={record => hdlTableCityRowClick(record)}/>
    </div>
  )

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key="submit" onClick={() => hdlButtonSaveClick()} type="primary" >Save</Button>,
      ]}
    >
      <Form layout="horizontal">
        <Row>
          <Col span={12}>
            <FormItem label="ID" hasFeedback {...formItemLayout}>
              {getFieldDecorator('supplierCode', {
                initialValue: item.supplierCode,
                rules: [{
                  required: true,
                  pattern: /^[a-z0-9\_]{2,15}$/i,
                  message: "a-Z & 0-9"
                }],
              })(
                <Input maxLength={15} />
              )}
            </FormItem>
            <FormItem label="Supplier Name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('supplierName', {
                initialValue: item.supplierName,
                rules: [{
                  required: true,
                  pattern: /^[a-z0-9\_\- ]{3,50}$/i,
                  message: 'a-Z & 0-9',
                }],
              })(<Input placeholder="Input your supplier name" maxLength={50} />)}
            </FormItem>
            <FormItem label="Address 1" hasFeedback {...formItemLayout}>
              {getFieldDecorator('address01', {
                initialValue: item.address01,
                rules: [
                  {
                    required: true,
                    pattern: /^[a-z0-9-_. ]{5,50}$/i,
                    message: "a-Z & 0-9"
                  },
                ],
              })(<Input maxLength={50} />)}
            </FormItem>
            <FormItem label="Address 2" hasFeedback {...formItemLayout}>
              {getFieldDecorator('address02', {
                initialValue: item.address02,
                rules: [
                  {
                    required: false,
                    pattern: /^[a-z0-9-_. ]{5,50}$/i,
                    message: "a-Z & 0-9"
                  },
                ],
              })(<Input maxLength={50} />)}
            </FormItem>
            <FormItem label="City" hasFeedback {...formItemLayout}>
              <Popover visible={visiblePopoverCity}
                onVisibleChange={() => hdlPopoverVisibleCityChange()}
                title={titlePopover}
                content={contentPopoverCity}
                trigger="click"
              >
                <Button
                  type="primary"
                  onClick={() => hdlButtonCityClick()}
                ><Icon type="environment" />
                </Button>
              </Popover>
              {getFieldDecorator('cityId', {
                initialValue: item.cityId,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input disabled style={{width: 40}}/>)}
              {getFieldDecorator('city', {
                initialValue: item.city,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input disabled style={{width: 100}}/>)}
            </FormItem>
            <FormItem label="Province" hasFeedback {...formItemLayout}>
              {getFieldDecorator('state', {
                initialValue: item.state,
                rules: [
                  {
                    required: false,
                    pattern: /^[a-z0-9\_\-]{3,20}$/i,
                    message: "a-Z & 0-9",
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Post Code" hasFeedback {...formItemLayout}>
              {getFieldDecorator('zipCode', {
                initialValue: item.zipCode,
                rules: [
                  {
                    required: false,
                    pattern: /^[a-z0-9\_\-]{3,5}$/i,
                    message: 'Not a Postal Code',
                  },
                ],
              })(<Input maxLength="5" />)}
            </FormItem>
            <FormItem label="Phone" hasFeedback {...formItemLayout}>
              {getFieldDecorator('phoneNumber', {
                initialValue: item.phoneNumber,
                rules: [
                  {
                    required: true,
                    pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                    message: 'Input a Phone No.[xxxx xxxx xxxx]',
                  },
                ],
              })(<Input defaultvalue="0811658292" />)}
            </FormItem>
            <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mobileNumber', {
                initialValue: item.mobileNumber,
                rules: [
                  {
                    required: true,
                    pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                    message: 'Input a Phone No.[xxxx xxxx xxxx]',
                  },
                ],
              })(<Input defaultvalue="0811658292" />)}
            </FormItem>
            <FormItem label="E-mail" hasFeedback {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: item.email,
                rules: [
                  {
                    required: false,
                    pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    message: 'The input is not valid E-mail!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Tax ID" hasFeedback {...formItemLayout}>
              {getFieldDecorator('taxId', {
                initialValue: item.taxId,
                rules: [
                  {
                    required: false,
                    pattern: /^\d{15}$/,
                    message: 'invalid NPWP',
                  },
                ],
              })(<Input maxLength="15" defaultvalue="123456789012345" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onChooseItem: PropTypes.func,
  enablePopover: PropTypes.func,
  onChooseCity: PropTypes.func,
  modalIsEmployeeChange: PropTypes.func,
}

export default Form.create()(modal)
