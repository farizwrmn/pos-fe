import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Cascader, Checkbox, Button, Row, Col, Popover, Table, Collapse } from 'antd'

const FormItem = Form.Item
const Panel = Collapse.Panel

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item = {},
  listLovEmployee = [],
  listUserRole = [],
  onOk,
  onChooseItem,
  visiblePopover = false,
  disabledItem = { userId: true, getEmployee: true },
  modalPopoverVisible,
  modalPopoverClose,
  modalIsEmployeeChange,
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
      data.userRole = data.userRole.join(' ')

      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const columns = [{
    title: 'Employee Id',
    dataIndex: 'employeeId',
    key: 'employeeId',
    width: 100,
  }, {
    title: 'Name',
    dataIndex: 'employeeName',
    key: 'employeeName',
    width: 200,
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 250,
  }, {
    title: 'Position',
    dataIndex: 'positionName',
    key: 'positionName',
    width: 200,
  }]

  const hdlTableRowClick = (record) => {
    onChooseItem(record)
  }

  const hdlPopoverVisibleChange = () => {
    modalPopoverVisible()
  }

  const hdlPopoverClose = () => {
    modalPopoverClose()
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
      if (data.userRole !== undefined) {
        data.userRole = data.userRole.toString()
      } else {
        data.userRole = ''
      }
      // data.active = data.active !== undefined ? true : false

      // if there is no update on password
      if (modalProps.modalType === 'edit' && data.password === 'xxxxxx') {
        delete data.password
        delete data.confirm
      }
      console.log('hdlButtonSaveClick', data)
      modalButtonSaveClick(data.userId, data)
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
      <Col span={8}>Choose Employee</Col>
      <Col span={1} offset={15}>
        <Button shape="circle" icon="close-circle" size="small"
          onClick={() => hdlPopoverClose()}/>
      </Col>
    </Row>
  )
  const contentPopover = (
    <div>
      <Table
        columns={columns}
        dataSource={listLovEmployee}
        size='small'
        bordered
        pagination={{ pageSize: 5 }}
        onRowClick={(record) => hdlTableRowClick(record)}
      />
    </div>
  )

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key='back'   onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key='submit' onClick={() => hdlButtonSaveClick()} type='primary' >Save</Button>,
      ]}
    >
      <Form layout='horizontal'>
        <FormItem label='is Employee ?' {...formItemLayout} >
          {getFieldDecorator('isEmployee', {
            valuePropName: 'checked',
            initialValue: ((item.isEmployee == null || item.isEmployee == true) ? true : item.isEmployee),
          })(<Checkbox disabled={(item.isEmployee == null || item.isEmployee == true) ? true : false}
              //onChange={(e) => hdlCheckboxChange(e)}
            />)}
        </FormItem>
        <FormItem label='User Id' hasFeedback {...formItemLayout}
          extra='If user is employee then click [Get Employee].'
        >
          <Row gutter={2}>
            <Col span={10}>
              <Popover visible={visiblePopover}
                onVisibleChange={() => hdlPopoverVisibleChange()}
                title={titlePopover}
                content={contentPopover}
                trigger='click'>
                <Button type='primary'
                  disabled={disabledItem.getEmployee} > Get Employee
                </Button>
              </Popover>
            </Col>
            <Col span={14}>
              {getFieldDecorator('userId', {
                initialValue: item.userId,
                rules: [{ required: true, min: 6 }],
              })(
                <Input disabled />
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem label='User Name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('userName', {
            initialValue: item.userName,
            rules: [{ required: true, min: 4 }],
          })(<Input />)}
        </FormItem>
        <FormItem label='Active' {...formItemLayout}>
          {getFieldDecorator('active', {
            valuePropName: 'checked',
            initialValue: ((item.active == null || item.active == true) ? true : item.active)
          })(<Checkbox />)}
        </FormItem>
        <FormItem label='User Role' hasFeedback {...formItemLayout}>
          {getFieldDecorator('userRole', {
            initialValue: item.userRoleCode && item.userRoleCode.split(' '),
          })(<Cascader
            size='large'
            style={{ width: '100%' }}
            options={listUserRole}
            placeholder='Choose user role'
          />)}
        </FormItem>
        <FormItem label='E-mail' hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              {
                required: true,
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                message: 'The input is not valid E-mail!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label='Full Name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('fullName', {
            initialValue: item.fullName,
            rules: [{ min: 4 }],
          })(<Input />)}
        </FormItem>
        <Collapse accordion >
          <Panel header="Password" key="1">
            <FormItem label='Choose a password' hasFeedback {...formItemLayout}>
              {getFieldDecorator('password', {
                initialValue: 'xxxxxx',
                rules: [{
                  required: true, min: 6, message: 'Please input your password!',
                }, {
                  validator: hdlCheckConfirm,
                }],
              })(
                <Input type='password' />
              )}
            </FormItem>
            <FormItem label="Re-enter password" hasFeedback {...formItemLayout}>
              {getFieldDecorator('confirm', {
                initialValue: 'xxxxxx',
                rules: [{
                  required: true, min: 6, message: 'Please confirm your password!',
                }, {
                  validator: hdlCheckPassword,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
          </Panel>
        </Collapse>

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
  modalIsEmployeeChange: PropTypes.func,
}

export default Form.create()(modal)
