import React from 'react'
import PropTypes from 'prop-types'
import { Select,Form, Input, Table, Modal, Row, Col, Icon, Popover, Button} from 'antd'
import BrowseType from './servicetype'
const Option = Select.Option;

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item = {},
  onOk,
  visiblePopover = false,
  modalButtonCancelClick,
  modalButtonSaveClick,
  modalPopoverVisibleType,
  modalPopoverClose,
  modalPopoverVisible,
  listServType,
  modalServTypeClick,
  listServiceType,
  onChooseItem,
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

  const hdlTableRowClick = (record) => {
    console.log('hdlTableRowClick', record);
    onChooseItem(record)
  }

  const contentPopover = (
    <div>
      <BrowseType
        dataSource={listServType}
        pagination={false}
        size = "small"
        onRowClick={record => hdlTableRowClick(record)}
      />
    </div>
  )

  const hdlPopoverVisibleTypeChange = () => {
    console.log('hdlPopoverVisibleTypeChange');
    modalPopoverVisibleType()
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

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key="submit" onClick={() => hdlButtonSaveClick()} type="primary" >Save</Button>,
      ]}
    >
      <Form layout="horizontal">
        <FormItem label="Code" hasFeedback {...formItemLayout}>
          {getFieldDecorator('serviceCode', {
            initialValue: item.serviceCode,
            rules: [{
              required: true,
              pattern: /^([A-Za-z0-9_-_!. ]{0,30})$/,
            }],
          })(<Input maxLength={25}/>)}
        </FormItem>
        <FormItem label="Service" hasFeedback {...formItemLayout}>
          {getFieldDecorator('serviceName', {
            initialValue: item.serviceName,
            rules: [{
              required: true,
              pattern: /^([a-zA-Z0-9_-_!. ]{0,30})$/,
            }],
          })(<Input maxLength={50}/>)}
        </FormItem>
        <FormItem label="Cost" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cost', {
            initialValue: item.cost,
            rules: [{
              required: false,
            }],
          })(<Input maxLength={19}/>)}
        </FormItem>
        <FormItem label="Service Cost" hasFeedback {...formItemLayout}>
          {getFieldDecorator('serviceCost', {
            initialValue: item.serviceCost,
            rules: [{
              required: false,
            }],
          })(<Input maxLength={19}/>)}
        </FormItem>
        <FormItem label="Service Type" hasFeedback {...formItemLayout}>
          {getFieldDecorator('serviceTypeId', {
            initialValue: item.serviceTypeId,
            rules: [{
              required: false,
            }],
          })(<Select defaultValue="PS" style={{ width: 120 }}>
            <Option value="PS">PS</Option>
            <Option value="GT">GT</Option>
            <Option value="SCRAP">SCRAP</Option>
            <Option value="SR">SR</Option>
            <Option value="TDF">TDF</Option>
          </Select>)}
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
  enablePopover: PropTypes.func,
}

export default Form.create()(modal)
