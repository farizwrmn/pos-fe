import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Checkbox, Tabs, Table, Radio, Select } from 'antd'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
    md: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
    md: { span: 20 }
  }
}

const formMandatoryField = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
    md: { span: 9 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 14 }
  }
}

const ModalMobile = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  },
  onSubmitMobileUser,
  listGroup,
  listType,
  listIdType,
  listCity,
  onActivate,
  dataCustomer,
  checkMemberCardId,
  checkMember,
  enabledItem,
  openModal,
  activateMember,
  modalVisible,
  ...modalMobileProps
}) => {
  const infoCheck = (checkMember.info) ? {
    memberStatus: checkMember.info.memberStatus,
    memberCode: checkMember.info.memberCode
  } : { memberStatus: '', memberCode: '' }
  const dataMember = (checkMember.dataMember) ? {
    mobileNumber: checkMember.dataMember.mobileNumber,
    email: checkMember.dataMember.memberEmail,
    name: checkMember.dataMember.memberName,
    point: checkMember.dataMember.memberPoint,
    valid: checkMember.dataMember.validThrough
  } : { email: '', name: '', point: '', valid: '' }

  const columnAsset = [
    { title: 'Police No', dataIndex: 'policeNo', key: 'policeNo' },
    { title: 'Merk', dataIndex: 'merk', key: 'merk' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Chassis No', dataIndex: 'chassisNo', key: 'chassisNo' },
    { title: 'Machine No', dataIndex: 'machineNo', key: 'machineNo' }]
  const dataAsset = (checkMember.dataAsset) ? checkMember.dataAsset : []

  const columnBooking = [
    { title: 'Booking ID', dataIndex: 'bookingId', key: 'bookingId' },
    { title: 'Date', dataIndex: 'scheduleDate', key: 'scheduleDate' },
    { title: 'Time', dataIndex: 'scheduleTime', key: 'scheduleTime' },
    { title: 'Store', dataIndex: 'store', key: 'store' }]
  const dataBooking = (checkMember.dataBooking) ? checkMember.dataBooking : []

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      if (!dataCustomer.id) return
      const params = {
        id: dataCustomer.id,
        memberCardId: data.memberCardId
      }
      onActivate(params)
      resetFields()
    })
  }

  const mobileOpts = {
    onOk: handleOk,
    ...modalMobileProps
  }

  let memberStatusInfo
  if (checkMember.info) {
    memberStatusInfo = checkMember.info.memberStatus.split('|')[1]
  } else {
    memberStatusInfo = 'status'
  }

  const handleCheckMemberCardId = () => {
    document.getElementById('mandatory').removeAttribute('style')
    checkMemberCardId(getFieldsValue().memberCardId)
  }
  const handleCheckExisting = (checked) => {
    enabledItem('existing', !checked)
  }
  const handleCheckConfirm = (checked) => {
    enabledItem('confirm', !checked)
  }
  const handleSearchMember = () => {
    openModal()
  }
  const handleActivate = () => {
    let data = getFieldsValue()
    validateFields((errors) => {
      if (errors) {
        document.getElementById('mandatory').style.color = 'red'
        return
      }
      activateMember(data)
    })
    resetFields()
  }

  let notRequired = (!checkMember.existingSearchButtonDisable && !!dataCustomer.memberCode)

  const childrenGroup = listGroup.length > 0 ? listGroup.map(group => <Option value={group.id} key={group.id}>{group.groupName}</Option>) : []
  const childrenType = listType.length > 0 ? listType.map(type => <Option value={type.id} key={type.id}>{type.typeName}</Option>) : []
  const childrenLov = listIdType.length > 0 ? listIdType.map(lov => <Option value={lov.key} key={lov.key}>{lov.title}</Option>) : []
  const childrenCity = listCity.length > 0 ? listCity.map(city => <Option value={city.id} key={city.id}>{city.cityName}</Option>) : []

  return (
    <div>
      {modalVisible && <ModalBrowse {...modalMobileProps} />}
      <Form layout="horizontal" {...mobileOpts}>
        <FormItem label="Member Card ID" {...formItemLayout}>
          <Col xs={{ span: 10, offset: 2 }} sm={{ span: 9, offset: 3 }} md={{ span: 10, offset: 2 }}>
            {getFieldDecorator('memberCardId', {
              initialValue: infoCheck.memberCode || ''
            })(
              <Input placeholder="input here"
                addonAfter={memberStatusInfo}
              />
            )}
          </Col>
          <Col xs={{ span: 3, offset: 2 }} md={{ span: 2, offset: 10 }}>
            <Button className="button-line-height1"
              type="primary"
              onClick={() => handleCheckMemberCardId()}
            >Check</Button>
          </Col>
        </FormItem>

        <FormItem label="Existing Member" {...formItemLayout}>
          <Col span="1" offset={1}>
            <Checkbox disabled={checkMember.existingCheckBoxDisable}
              onChange={e => handleCheckExisting(e.target.checked)}
            />
          </Col>
          <Col xs={{ span: 10, offset: 2 }} sm={{ span: 9, offset: 3 }} md={{ span: 10, offset: 0 }}>
            {getFieldDecorator('memberCode', {
              initialValue: dataCustomer.memberCode || 'code'
            })(
              <Input disabled
                placeholder="code"
                addonAfter={dataCustomer.memberName || 'name'}
              />
            )}
          </Col>
          <Col xs={{ span: 3, offset: 2 }} md={{ span: 2, offset: 10 }}>
            <Button className="button-line-height1"
              disabled={checkMember.existingSearchButtonDisable}
              onClick={() => handleSearchMember()}
            >Search</Button>
          </Col>
        </FormItem>

        <section className="tab-card-box">
          <div className="tab-card-container tab-card-mobile">
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="data Member" key="1">
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input disabled addonBefore="Email" placeholder="member email" value={dataMember.email} />
                  </Col>
                </Row>
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input disabled addonBefore="Name" placeholder="member names" value={dataMember.name} />
                  </Col>
                </Row>
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input disabled addonBefore="Cashback" placeholder="member cashback" value={dataMember.cashback} />
                  </Col>
                </Row>
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input disabled addonBefore="Valid   " placeholder="member valid through" value={dataMember.valid} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="data Asset" key="2">
                <Table columns={columnAsset} dataSource={dataAsset} />
              </TabPane>
              <TabPane tab="data Booking" key="3">
                <Table columns={columnBooking} dataSource={dataBooking} />
              </TabPane>
              <TabPane tab={<div id="mandatory">data Mandatory {!notRequired && <span style={{ color: 'red' }}>*</span>}</div>} key="4">
                <Row>
                  <Col xs={24} sm={12} md={12} lg={12} >
                    <FormItem label="Group Name" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('memberGroupId', {
                        rules: [{ required: !notRequired }]
                      })(<Select
                        showSearch
                        autoFocus
                        placeholder="Select Group Name"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >{childrenGroup}
                      </Select>)}
                    </FormItem>
                    <FormItem label="Type Name" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('memberTypeId', {
                        rules: [{ required: !notRequired }]
                      })(<Select
                        showSearch
                        placeholder="Select Type Name"
                        optionFilterProp="children"
                        mode="default"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >{childrenType}
                      </Select>)}
                    </FormItem>
                    <FormItem label="ID Type" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('idType', {
                        rules: [{ required: !notRequired }]
                      })(<Select
                        optionFilterProp="children"
                        mode="default"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >{childrenLov}
                      </Select>)}
                    </FormItem>
                    <FormItem label="ID No" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('idNo', {
                        rules: [
                          {
                            required: !notRequired,
                            pattern: /^[A-Za-z0-9-_. ]{3,30}$/i,
                            message: 'a-Z & 0-9'
                          }
                        ]
                      })(<Input maxLength={30} />)}
                    </FormItem>
                    <FormItem label="Address" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('address01', {
                        rules: [
                          {
                            required: !notRequired,
                            pattern: /^[A-Za-z0-9-._/ ]{5,50}$/i,
                            message: 'a-Z & 0-9'
                          }
                        ]
                      })(<Input maxLength={50} />)}
                    </FormItem>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} >
                    <FormItem label="City" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('cityId', {
                        rules: [
                          {
                            required: !notRequired
                          }
                        ]
                      })(<Select
                        optionFilterProp="children"
                        mode="default"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >{childrenCity}
                      </Select>)}
                    </FormItem>
                    <FormItem label="Phone Number" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('phoneNumber', {
                        rules: [
                          {
                            required: !notRequired,
                            pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                            message: 'Input a Phone No.[xxxx xxxx xxxx]'
                          }
                        ]
                      })(<Input />)}
                    </FormItem>
                    <FormItem label="Mobile Number" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('mobileNumber', {
                        initialValue: dataMember.mobileNumber,
                        rules: [
                          {
                            required: !notRequired,
                            pattern: /^\(?(0[0-9]{3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{4,5})$/,
                            message: 'mobile number is not valid'
                          }
                        ]
                      })(<Input />)}
                    </FormItem>
                    <FormItem label="Gender" hasFeedback {...formMandatoryField}>
                      {getFieldDecorator('gender', {
                        rules: [{ required: !notRequired }]
                      })(
                        <Radio.Group>
                          <Radio value="1">Male</Radio>
                          <Radio value="0">Female</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </section>

        <Col xs={{ span: 3, offset: 2 }} md={{ span: 3, offset: 0 }} />
        <FormItem label="" {...formItemLayout}>
          <Col xs={{ span: 10, offset: 2 }} sm={{ span: 9, offset: 3 }} md={{ span: 9, offset: 1, pull: 4 }}>
            <Checkbox disabled={checkMember.confirmCheckBoxDisable}
              checked={checkMember.confirmCheckBoxCheck}
              onChange={e => handleCheckConfirm(e.target.checked)}
            >
              have user confirmed mobile data to customer?
            </Checkbox>
          </Col>
          <Col xs={{ span: 3, offset: 2 }} md={{ span: 2, offset: 12 }}>
            <Button className="button-line-height1"
              disabled={checkMember.activateButtonDisable}
              onClick={() => handleActivate()}
            >Activate</Button>
          </Col>
        </FormItem>
      </Form>
    </div >
  )
}

ModalMobile.propTypes = {
  form: PropTypes.object.isRequired,
  checkMember: PropTypes.object
}

export default Form.create()(ModalMobile)
