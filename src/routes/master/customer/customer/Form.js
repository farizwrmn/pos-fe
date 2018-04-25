import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Tabs, Select, message, DatePicker, Radio, Row, Col, Icon, Dropdown, Menu } from 'antd'
import moment from 'moment'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
// const ButtonGroup = Button.Group

const formItemLayout = {
  labelCol: {
    xs: { span: 13 },
    sm: { span: 8 },
    md: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 11 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: { offset: 17 },
    sm: { offset: 19 },
    md: { offset: 18 },
    lg: { offset: 17 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const formCustomer = ({
  item = {},
  onSubmit,
  disabled,
  clickBrowse,
  activeKey,
  listGroup,
  listType,
  listCity,
  listIdType,
  showCustomerGroup,
  showCustomerType,
  showIdType,
  showCity,
  button,
  changeTab,
  ...listProps,
  ...filterProps,
  ...printProps,
  ...tabProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const { show } = filterProps
  const { onShowHideSearch,
    list,
    listPrintAllCustomer,
    changed,
    mode,
    customerLoading,
    showPDFModal,
    onShowPDFModal,
    onHidePDFModal,
    getAllCustomer
  } = tabProps
  const handleReset = () => {
    resetFields()
  }

  const change = (key) => {
    changeTab(key)
    handleReset()
  }

  const customerGroup = () => {
    showCustomerGroup()
  }

  const customerType = () => {
    showCustomerType()
  }

  const idType = () => {
    showIdType()
  }

  const cities = () => {
    showCity()
  }

  const browse = () => {
    clickBrowse()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }

      if (data.memberCode) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data.memberCode, data)
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

  const PDFModalProps = {
    visible: showPDFModal,
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
    onCancel () {
      onHidePDFModal()
    }
  }

  const changeButton = () => {
    getAllCustomer()
  }

  let buttonClickPDF = changed ? (<PrintPDF data={listPrintAllCustomer} name="Print All Customer" {...printProps} />) : (<Button type="default" size="large" onClick={changeButton} loading={customerLoading}><Icon type="file-pdf" />Get All Customer</Button>)
  let buttonClickXLS = changed ? (<PrintXLS data={listPrintAllCustomer} name="Print All Customer" {...printProps} />) : (<Button type="default" size="large" onClick={changeButton} loading={customerLoading}><Icon type="file-pdf" />Get All Customer</Button>)
  let notification = changed ? "Click 'Print All Customer' to print!" : "Click 'Get All Customer' to get all data!"
  let printmode
  if (mode === 'pdf') {
    printmode = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintPDF data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    printmode = (<Row><Col md={12}>{buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintXLS data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  }

  const openPDFModal = (mode) => {
    onShowPDFModal(mode)
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => openPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => openPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button> <Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  const childrenGroup = listGroup.length > 0 ? listGroup.map(group => <Option value={group.id} key={group.id}>{group.groupName}</Option>) : []
  const childrenType = listType.length > 0 ? listType.map(type => <Option value={type.id} key={type.id}>{type.typeName}</Option>) : []
  const childrenLov = listIdType.length > 0 ? listIdType.map(lov => <Option value={lov.key} key={lov.key}>{lov.title}</Option>) : []
  const childrenCity = listCity.length > 0 ? listCity.map(city => <Option value={city.id} key={city.id}>{city.cityName}</Option>) : []

  // const tabOperations = (<div>
  //   <ButtonGroup size="small">
  //     <Button type="primary">
  //       <Icon type="printer" /> Print
  //     </Button>
  //     <Button >
  //       <Icon type="search" /> Search
  //     </Button>
  //   </ButtonGroup>
  // </div>)

  return (
    <div>
      {showPDFModal && <Modal footer={[]} {...PDFModalProps}>
        {printmode}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          <Form layout="horizontal">
            <Row>
              <Col {...column}>
                <FormItem label="Member Group Name" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberGroupId', {
                    initialValue: item.memberGroupId,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    showSearch
                    autoFocus
                    placeholder="Select Member Group Name"
                    optionFilterProp="children"
                    onFocus={customerGroup}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >{childrenGroup}
                  </Select>)}
                </FormItem>
                <FormItem label="Member Type Name" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberTypeId', {
                    initialValue: item.memberTypeId,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    showSearch
                    placeholder="Select Member Type Name"
                    optionFilterProp="children"
                    mode="default"
                    onFocus={customerType}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >{childrenType}
                  </Select>)}
                </FormItem>
                <FormItem label="Member Code" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberCode', {
                    initialValue: item.memberCode,
                    rules: [
                      {
                        required: true,
                        pattern: /^[a-z0-9_-]{3,16}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input disabled={disabled} maxLength={16} />)}
                </FormItem>
                <FormItem label="Member Name" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('memberName', {
                    initialValue: item.memberName,
                    rules: [
                      {
                        required: true,
                        pattern: /^[a-z0-9_. ,-]{3,50}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={50} />)}
                </FormItem>
                <FormItem label="ID Type" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('idType', {
                    initialValue: item.idType,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    optionFilterProp="children"
                    mode="default"
                    onFocus={idType}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >{childrenLov}
                  </Select>)}
                </FormItem>
                <FormItem label="ID No" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('idNo', {
                    initialValue: item.idNo,
                    rules: [
                      {
                        required: true,
                        pattern: /^[A-Za-z0-9-_. ]{3,30}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={30} />)}
                </FormItem>
                <FormItem label="Address 01" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address01', {
                    initialValue: item.address01,
                    rules: [
                      {
                        required: true,
                        pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={50} />)}
                </FormItem>
                <FormItem label="Address 02" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('address02', {
                    initialValue: item.address02,
                    rules: [
                      {
                        pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={50} />)}
                </FormItem>
                <FormItem label="City" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('cityId', {
                    initialValue: item.cityId,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(<Select
                    optionFilterProp="children"
                    mode="default"
                    onFocus={cities}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >{childrenCity}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...column} >
                <FormItem label="State" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('state', {
                    initialValue: item.state,
                    rules: [
                      {
                        pattern: /^[a-z0-9_-]{3,20}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={20} />)}
                </FormItem>
                <FormItem label="Zip Code" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('zipCode', {
                    initialValue: item.zipCode,
                    rules: [
                      {
                        pattern: /^[a-z0-9_-]{3,20}$/i,
                        message: 'a-Z & 0-9'
                      }
                    ]
                  })(<Input maxLength={20} />)}
                </FormItem>
                <FormItem label="Phone Number" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('phoneNumber', {
                    initialValue: item.phoneNumber
                  })(<Input />)}
                </FormItem>
                <FormItem label="Mobile Number" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('mobileNumber', {
                    initialValue: item.mobileNumber,
                    rules: [
                      {
                        required: true,
                        pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                        message: 'mobile number is not valid'
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem label="Email" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('email', {
                    initialValue: item.email,
                    rules: [
                      {
                        required: false,
                        pattern: /^([a-zA-Z0-9._-a-zA-Z0-9])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                        message: 'The input is not valid E-mail!'
                      }
                    ]
                  })(<Input />)}
                </FormItem>
                <FormItem label="Birth Date" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('birthDate', {
                    initialValue: item.birthDate ? moment(item.birthDate) : null
                  })(<DatePicker />)}
                </FormItem>
                <FormItem label="Tax ID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('taxId', {
                    initialValue: item.taxId,
                    rules: [
                      {
                        pattern: /^[0-9]{3,15}$/,
                        message: '0-9'
                      }
                    ]
                  })(<Input maxLength={15} />)}
                </FormItem>
                <FormItem label="Gender" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    initialValue: item.gender,
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Radio.Group value={item.gender}>
                      <Radio value="M">Male</Radio>
                      <Radio value="F">Female</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" onClick={handleSubmit}>{button}</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

formCustomer.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  listGroup: PropTypes.object.isRequired,
  listType: PropTypes.object.isRequired,
  listCity: PropTypes.object.isRequired,
  listIdType: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  clickBrowse: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
  activeKey: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  showCustomerGroup: PropTypes.func.isRequired,
  showCustomerType: PropTypes.func.isRequired,
  showIdType: PropTypes.func.isRequired,
  showCity: PropTypes.func
}

export default Form.create()(formCustomer)
