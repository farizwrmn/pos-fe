import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, InputNumber, Button, Tabs, Row, Col, Dropdown, Menu, Icon, Collapse, message, Modal } from 'antd'
import List from './List'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Panel = Collapse.Panel

const formItemLayout = {
  labelCol: {
    xs: {
      span: 13
    },
    sm: {
      span: 8
    },
    md: {
      span: 7
    }
  },
  wrapperCol: {
    xs: {
      span: 11
    },
    sm: {
      span: 14
    },
    md: {
      span: 14
    }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 17
    },
    sm: {
      offset: 19
    },
    md: {
      offset: 18
    },
    lg: {
      offset: 17
    }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formCustomerType = ({
  item,
  onSubmit,
  listItem,
  disabled,
  clickBrowse,
  activeKey,
  customerInfo,
  button,
  modalVisible,
  ...tabProps,
  ...listProps,
  ...printProps,
  ...modalProps,
  changeTab,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const { openModal } = modalProps
  Object.assign(modalProps, { activeKey })

  printProps.dataCustomer = customerInfo

  const handleReset = () => {
    resetFields()
  }

  const change = (key) => {
    changeTab(key)
    handleReset()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const { memberName, memberTypeName, birthDate, cityName, address01, ...other } = data
      if (data.memberCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(other)
            setTimeout(() => {
              resetFields()
            }, 500)
          },
          onCancel () { }
        })
      } else {
        message.warning("Member Code can't be null")
      }
    })
  }

  const browse = () => {
    clickBrowse()
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )
  const info = (
    <div>
      <FormItem label="Member Code" {...formItemLayout} >
        {getFieldDecorator('memberCode', {
          initialValue: customerInfo.memberCode
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Name" {...formItemLayout}>
        {getFieldDecorator('memberName', {
          initialValue: customerInfo.memberName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="BirthDate" {...formItemLayout}>
        {getFieldDecorator('birthDate', {
          initialValue: customerInfo.birthDate ? moment(customerInfo.birthDate).format('MMMM Do YYYY') : ''
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="City" {...formItemLayout}>
        {getFieldDecorator('cityName', {
          initialValue: customerInfo.cityName
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Address" {...formItemLayout}>
        {getFieldDecorator('address01', {
          initialValue: customerInfo.address01
        })(<Input disabled />)}
      </FormItem>
      <FormItem label="Member Type" {...formItemLayout}>
        {getFieldDecorator('memberTypeName', {
          initialValue: customerInfo.memberTypeName
        })(<Input disabled />)}
      </FormItem>
    </div>
  )

  const collapseActiveKey = '1'
  const collapseTitle = customerInfo.memberCode ? `Customer Info(${customerInfo.memberCode})` : 'Customer Info'

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (listItem.length > 0 ? (<Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown>) : '')

  return (
    <div>
      {modalVisible && <ModalBrowse {...modalProps} />}
      <Tabs activeKey={activeKey} {...tabProps} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          <Form layout="horizontal">
            <Row>
              <Col {...column}>
                <FormItem label="Member Code" hasFeedback {...formItemLayout}>
                  <Button disabled={disabled} type="primary" size="large" onClick={openModal} style={{ marginBottom: 15 }}>Find Customer</Button>
                </FormItem>
                <FormItem label="Police No" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('policeNo', {
                    initialValue: item.policeNo,
                    rules: [
                      {
                        required: true,
                        pattern: /^[A-Z0-9]{1,10}\S+$/,
                        message: 'A-Z & 0-9'
                      }
                    ]
                  })(<Input disabled={disabled} maxLength={10} autoFocus />)}
                </FormItem>
                <FormItem label="Merk" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('merk', {
                    initialValue: item.merk,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem label="Model" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('model', {
                    initialValue: item.model,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem label="Tipe" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('type', {
                    initialValue: item.type
                  })(<Input maxLength={30} />)}
                </FormItem>
                <FormItem label="Tahun" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('year', {
                    initialValue: item.year,
                    rules: [
                      {
                        pattern: /^[12][0-9]{3}$/,
                        message: 'year is not valid'
                      }
                    ]
                  })(<InputNumber />)}
                </FormItem>
                <FormItem label="No Rangka" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('chassisNo', {
                    initialValue: item.chassisNo
                  })(<Input maxLength={20} />)}
                </FormItem>
                <FormItem label="No Mesin" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('machineNo', {
                    initialValue: item.machineNo
                  })(<Input maxLength={20} />)}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" onClick={handleSubmit}>{button}</Button>
                </FormItem>
              </Col>
              <Col {...column}>
                <Collapse defaultActiveKey={collapseActiveKey} >
                  <Panel header={collapseTitle} key="1">
                    {info}
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Button type="primary" size="large" onClick={openModal} style={{ marginBottom: 15 }}>Find Customer</Button>
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

formCustomerType.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  listItem: PropTypes.object,
  customerInfo: PropTypes.object,
  onSubmit: PropTypes.func,
  clickBrowse: PropTypes.func,
  changeTab: PropTypes.func,
  activeKey: PropTypes.string,
  modalVisible: PropTypes.bool,
  button: PropTypes.string
}

export default Form.create()(formCustomerType)
