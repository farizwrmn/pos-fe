import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Checkbox, Tabs, Table } from 'antd'
import ModalBrowse from './Modal'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

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
    activateMember(getFieldsValue())
  }

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
          <div className="tab-card-container">
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
                    <Input disabled addonBefore="Point   " placeholder="member point" value={dataMember.point} />
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
              <TabPane tab="data Existing" key="4" disabled />
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
    </div>
  )
}

ModalMobile.propTypes = {
  form: PropTypes.object.isRequired,
  checkMember: PropTypes.object
}

export default Form.create()(ModalMobile)
