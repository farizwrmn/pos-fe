import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Button, Collapse, Row, Col, Checkbox, Tabs, Table, notification, Modal } from 'antd'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const Panel = Collapse.Panel
const TabPane = Tabs.TabPane
const warning = Modal.warning

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 4 },
    md: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 11 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const ModalMobile = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  },
  onActivate,
  dataCustomer,
  checkMemberCardId,
  checkMember,
  resetMemberStatus,
  enabledItem,
  modalVisible,
  ...modalMobileProps
}) => {
  const dataMember= (checkMember.dataMember) ? {
    email: checkMember.dataMember.memberEmail,
    name: checkMember.dataMember.memberName,
    point: checkMember.dataMember.memberPoint,
    valid: checkMember.dataMember.validThrough
  } : { email: "", name: "", point: "", valid: "" }

  const columnAsset = [
    { title: 'Police No', dataIndex: 'policeNo', key: 'policeNo' },
    { title: 'Merk', dataIndex: 'merk', key: 'merk' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Year', dataIndex: 'year', key: 'year'},
    { title: 'Chassis No', dataIndex: 'chassisNo', key: 'chassisNo'},
    { title: 'Machine No', dataIndex: 'machineNo', key: 'machineNo'}]
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

  const handleCheckMemberCardId = () => {
    checkMemberCardId(getFieldsValue().memberCardId)
  }
  const handleResetMemberStatus = () => {
    resetMemberStatus()
  }
  const handleCheckExisting = (checked) => {
    console.log('zzz11', checked)
    enabledItem('existing', !checked)
  }
  console.log('zzz7', checkMember)


  return (
    <div>
      <Modal
        title={'Member Card ID : ' + getFieldsValue().memberCardId}
        visible={checkMember.visibleModal}
        onOk={handleResetMemberStatus}
        onCancel={handleResetMemberStatus}
      >
        <p>{ 'status : ' + (checkMember.hasOwnProperty('info') && checkMember.info.memberStatus.split("|")[1] ) }</p>
      </Modal>
      
      <Form layout="horizontal" {...mobileOpts}>
        <FormItem label="Member Card ID" hasFeedback {...formItemLayout}>
          <Col span="8" offset={2}>
          {getFieldDecorator('memberCardId', {
            rules: [
              {
                required: true
              }
            ]
          })(<Input />
          )}
          </Col>
          <Col span="6" offset={1}>
          <Button className="button-line-height1" type="primary" onClick={() => handleCheckMemberCardId()}>Check</Button>
          </Col>
        </FormItem>
        <FormItem label="Existing Member" hasFeedback {...formItemLayout}>
          <Col span="1" offset={1}>
            <Checkbox disabled={checkMember.existingCheckBoxDisable} onChange={(e) => handleCheckExisting(e.target.checked)}></Checkbox>
          </Col>
          <Col span="8">
            {getFieldDecorator('memberCode', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input disabled={checkMember.existingInputBoxDisable}/>
            )}
          </Col>
          <Col span="6" offset={1}>
            <Button className="button-line-height1" disabled={checkMember.existingSearchButtonDisable}>Search</Button>
          </Col>
        </FormItem>

        <section className="tab-card-box">
          <div className="tab-card-container">
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="data Member" key="1">
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input addonBefore="Email" placeholder="member email" value={dataMember.email}/>
                  </Col>
                </Row>
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input addonBefore="Name" placeholder="member names" value={dataMember.name}/>
                  </Col>
                </Row>
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input addonBefore="Point   " placeholder="member point" value={dataMember.point}/>
                  </Col>
                </Row>
                <Row className="ant-form-item">
                  <Col xs={20} sm={16} md={12} lg={8} xl={4} offset="1">
                    <Input addonBefore="Valid   " placeholder="member valid through" value={dataMember.valid}/>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="data Asset" key="2">
                <Table columns={columnAsset} dataSource={dataAsset} />
              </TabPane>
              <TabPane tab="data Booking" key="3">
                <Table columns={columnBooking} dataSource={dataBooking} />
              </TabPane>
              <TabPane tab="data Existing" key="4" disabled>
              </TabPane>
            </Tabs>
          </div>
        </section>

        <FormItem label="" hasFeedback {...formItemLayout}>
          <Col span="16" offset={1}>
            <Checkbox disabled>have user confirmed mobile data to customer?</Checkbox>
          </Col>
          <Col span="6" offset={1}>
            <Button className="button-line-height1" disabled>Activate</Button>
          </Col>
        </FormItem>
      </Form>
    </div>
  )
}

ModalMobile.propTypes = {
  form: PropTypes.object.isRequired,
  checkMember: PropTypes.object
}

export default Form.create()(ModalMobile)
