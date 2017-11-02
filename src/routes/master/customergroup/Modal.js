import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Cascader, Checkbox, Button, Row, Col, Popover, Dropdown, Menu, Table, Icon, Collapse } from 'antd'
import Sellprice from './Sellprice'

const FormItem = Form.Item
const Panel = Collapse.Panel

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item = {},
  listMisc = [],
  onOk,
  visiblePopover = false,
  listSellPrice,
  onChooseItem,
  disabledItem = { userId: true, getEmployee: true },
  modalPopoverVisible,
  modalPopoverClose,
  modalIsEmployeeChange,
  modalButtonCancelClick,
  modalButtonSaveClick,
  modalSellPriceClick,
  // modalDropdownClick,
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

  const sellpriceprops = {
    dataSource: listSellPrice,
    size: "small",
    pagination: false
  }

  const hdlSellPriceRowClick=(record)=>{
    modalSellPriceClick(record)
  }

  const menu = (
    <Sellprice {...sellpriceprops} onRowClick={(record)=>hdlSellPriceRowClick(record)}/>
  );

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
      if (data.userRole !== undefined) {
        data.userRole = data.userRole.toString()
      } else {
        data.userRole = ''
      }
      data.active = data.active !== undefined

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
      <Col span={8}>Choose Employee</Col>
      <Col span={1} offset={15}>
        <Button shape="circle"
          icon="close-circle"
          size="small"
          onClick={() => hdlPopoverClose()}
        />
      </Col>
    </Row>
  )
  const contentPopover = (
    <div>
      <Table
        columns={columns}
        size="small"
        bordered
        pagination={{ pageSize: 5 }}
        onRowClick={record => hdlTableRowClick(record)}
      />
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
        <FormItem label="Code" hasFeedback {...formItemLayout}>
          {getFieldDecorator('groupCode', {
            initialValue: item.groupCode,
            rules: [{
              required: true,
              pattern: /^[a-z0-9\_]{1,5}$/i,
              message: "a-Z & 0-9"
            }],
          })(<Input maxLength={5} />)}
        </FormItem>
        <FormItem label="Group Name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('groupName', {
            initialValue: item.groupName,
            rules: [{
              required: true
            }],
          })(<Input />)}
        </FormItem>
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
  modalIsEmployeeChange: PropTypes.func
}

export default Form.create()(modal)
