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
  modalButtonCategoryClick,
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

  const hdlButtonCategoryClick = () => {
    console.log('hdlButtonCategoryClick');
    modalButtonCategoryClick()
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
          {getFieldDecorator('typeCode', {
            initialValue: item.typeCode,
            rules: [{
              required: true,
              pattern: /^[a-z0-9\_]{1,5}$/i,
            }],
          })(<Input maxLength={5} />)}
        </FormItem>
        <FormItem label="Type" hasFeedback {...formItemLayout}>
          {getFieldDecorator('typeName', {
            initialValue: item.typeName,
            rules: [{
              required: true,
              pattern: /^([a-zA-Z ]{0,30})$/,
            }],
          })(<Input />)}
        </FormItem>
        <FormItem label="DISC(%)-1" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discPct01', {
            initialValue: item.discPct01,
            rules: [{
              required: false,
              pattern: /^(\d{0,3})$/,
              message: 'incorrect value inserted',
              max: 3,
            }],
          })(<Input maxLength={3} />)}
        </FormItem>
        <FormItem label="DISC(%)-2" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discPct02', {
            initialValue: item.discPct02,
            rules: [{
              required: false,
              pattern: /^(\d{0,3})$/,
              message: 'incorrect value inserted',
              max: 3,
            }],
          })(<Input maxLength={3} />)}
        </FormItem>
        <FormItem label="DISC(%)-3" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discPct03', {
            initialValue: item.discPct03,
            rules: [{
              required: false,
              pattern: /^(\d{0,3})$/,
              message: 'incorrect value inserted',
              max: 3,
            }],
          })(<Input maxLength={3} />)}
        </FormItem>
        <FormItem label="DISC(Nominal)" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discNominal', {
            initialValue: item.discNominal,
            rules: [{
              required: false,
              pattern: /^\d{0,16}$/,
              message: 'incorrect value inserted',
            }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Category" hasFeedback {...formItemLayout}>
        <Popover
          visible={visiblePopover}
          title={titlePopover}
          content={menu}
          onVisibleChange={() => hdlPopoverVisibleChange()}
          trigger="click"
        >
          <Button type="primary">
          Category
          </Button>
        </Popover>
          {getFieldDecorator('sellPrice', {
            initialValue: item.sellPrice,
            rules: [{
              required: false,
            }],
          })(<Input disabled marginLeft={20} style={{width:120}}/>)}
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
