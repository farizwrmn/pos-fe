import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon, Button, Row, Col, Popover, Cascader } from 'antd'
import BrowseCity from './BrowseCity'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  item = [],
  listJobPosition = [],
  onOk,
  disableItem,
  listCity,
  modalButtonCancelClick,
  modalButtonSaveClick,
  modalPopoverVisibleCity,
  modalPopoverClose,
  onChooseCity,
  modalButtonCityClick,
  visiblePopoverCity = false,
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
      data.positionId = data.positionId.join(' ')

      onOk(data)
    })
  }
  const hdlPopoverVisibleCityChange = () => {
    modalPopoverVisibleCity()
  }
  const hdlPopoverClose = () => {
    modalPopoverClose()
  }
  const hdlTableCityRowClick = (record) => {
    onChooseCity(record)
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const hdlButtonCityClick = () => {
    modalButtonCityClick()
  }
  const contentPopoverCity = (
    <div>
      <BrowseCity pagination={false} dataSource={listCity}
      onRowClick={record => hdlTableCityRowClick(record)}/>
    </div>
  )
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

      if (data.positionId !== undefined) {
        data.positionId = data.positionId.toString()
      } else {
        data.positionId = ''
      }

      modalButtonSaveClick(data.employeeId, data)
    })
  }

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key='back'   onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key='submit' onClick={() => hdlButtonSaveClick()} type='primary' >Save</Button>,
      ]}
    >
      <Form layout='horizontal'>
        <FormItem label='Employee Id' hasFeedback {...formItemLayout} >
          {getFieldDecorator('employeeId', {
            initialValue: item.employeeId,
            rules: [{required: true, min:6, max: 10}],
          })(<Input disabled={disableItem.employeeId} />)}
        </FormItem>
        <FormItem label='Employee Name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('employeeName', {
            initialValue: item.employeeName,
            rules: [{required: true, min: 3, max: 50}],
          })(<Input />)}
        </FormItem>
        <FormItem label='Position' hasFeedback {...formItemLayout}>
          {getFieldDecorator('positionId', {
            initialValue: item.positionId ? item.positionId.toString(10).split(',').map(function(el){ return +el;}) : null
          })(<Cascader
            size='large'
            style={{ width: '100%' }}
            options={listJobPosition}
          />)}
        </FormItem>
        <FormItem label="Address 1" hasFeedback {...formItemLayout}>
          {getFieldDecorator('address01', {
            initialValue: item.address01,
            rules: [{ required: true, min: 10, max: 50 }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Address 2" hasFeedback {...formItemLayout}>
          {getFieldDecorator('address02', {
            initialValue: item.address02,
          })(<Input />)}
        </FormItem>
        <FormItem label="City" hasFeedback {...formItemLayout}>
        <Row>
        <Col span={5}>
        <Popover visible={visiblePopoverCity}
          onVisibleChange={() => hdlPopoverVisibleCityChange()}
          title={titlePopover}
          content={contentPopoverCity}
          trigger="click"
        >
          <Button
            type="primary"
            style={{width:50}}
            onClick={() => hdlButtonCityClick()}
          ><Icon type="environment" />
          </Button>
        </Popover>
        </Col>
        <Col span={4}>
          {getFieldDecorator('cityId', {
            initialValue: item.cityId,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input style={{width: 40}} disabled/>)}
          </Col>
          <Col span={4}>
          {getFieldDecorator('cityName', {
            initialValue: item.cityName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input style={{width: 96}} disabled/>)}
          </Col>
          </Row>
        </FormItem>
        <FormItem label="State" hasFeedback {...formItemLayout}>
          {getFieldDecorator('state', {
            initialValue: item.state,
            rules: [{ min: 4, max: 30 }],
          })(<Input />)}
        </FormItem>
        <FormItem label="ZipCode" hasFeedback {...formItemLayout}>
          {getFieldDecorator('zipCode', {
            initialValue: item.state,
            rules: [{ min: 5, max: 10 }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
          {getFieldDecorator('mobileNumber', {
            initialValue: item.mobileNumber,
            rules: [{
              required: true,
              pattern: /^0[8]\d{8,}$/, message: 'The input is not a valid format mobile number!'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Local Phone Number" hasFeedback {...formItemLayout}>
          {getFieldDecorator('phoneNumber', {
            initialValue: item.phoneNumber,
            rules: [{
              pattern: /^0[1-9]\d{5,}$/, message: 'The input is not a valid format phone number!'
            }],
          })(<Input />)}
        </FormItem>
        <FormItem label='E-mail' hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              {
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                message: 'The input is not valid E-mail!',
              },
            ],
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
}

export default Form.create()(modal)
