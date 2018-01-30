import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Select, DatePicker, Card } from 'antd'
import moment from 'moment'
import ModalBrowse from './Modal'

const formItemLayout = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 14,
    },
    md: {
      span: 14,
    },
  },
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 },
}

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

const Filter = ({
  listPoliceNo,
  listServiceType,
  modalVisible,
  customerInfo,
  openModal,
  onResetClick,
  resetHistory,
  onSearchClick,
  ...modalProps,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields,
  },
}) => {
  if (listPoliceNo.length > 0) {
    if (customerInfo.memberCode !== listPoliceNo[0].memberCode) {
      resetFields()
      resetHistory()
    }
  }

  const clickReset = () => {
    resetFields()
    onResetClick()
  }

  const clickSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = { ...getFieldsValue() }
      if (data.period === undefined) {
        data.period = []
      }
      if (data.serviceTypeId === undefined) {
        data.serviceTypeId = []
      }
      const { memberCode } = customerInfo
      onSearchClick(memberCode, data)
    })
  }

  const cardProps = {
    title: `${customerInfo.memberCode}`,
    style: { width: 300 },
    item: (
      <div>
        <Row gutter={16}>
          <Col span={6} >Name</Col>
          <Col span={18}>: {customerInfo.memberName}</Col>
        </Row>
        <Row gutter={16}>
          <Col span={6} >Address</Col>
          <Col span={18}>: {customerInfo.address01}</Col>
        </Row>
      </div>
    ),
  }

  const { item } = cardProps

  const groupPoliceNo = (listData, key) => {
    return listData.map(data => data[key]).filter((e, index, array) => index === array.indexOf(e))
  }

  const getPlat = listPoliceNo.length > 0 ? groupPoliceNo(listPoliceNo, 'policeNo') : []

  const plats = getPlat.map(bk => (<Option value={bk}>{bk}</Option>))

  const serviceTypes = listServiceType.map(service => (<Option value={service.miscName}>{service.miscDesc} ({service.miscName})</Option>))

  return (
    <Row>
      <Col {...column} >
        <FormItem label="Member Code" {...formItemLayout}>
          <Button type="primary" onClick={openModal} style={{ marginLeft: 15 }}>Find Customer</Button>
          {modalVisible && <ModalBrowse {...modalProps} />}
        </FormItem>
        <FormItem label="Police No" {...formItemLayout}>
          {getFieldDecorator('policeNo', { rules: [
            {
              required: true,
            },
          ] })(<Select
            showSearch
            allowClear
            style={{ width: 195, marginLeft: 14 }}
            placeholder="Select a plat"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {plats}
          </Select>)}

        </FormItem>
        <FormItem label="Period" {...formItemLayout}>
          {getFieldDecorator('period')(<RangePicker style={{ width: 195, marginLeft: 14 }} />)}
        </FormItem>
        <FormItem label="Service Type" {...formItemLayout}>
          {getFieldDecorator('serviceTypeId')(<Select
            showSearch
            allowClear
            style={{ width: 195, marginLeft: 14 }}
            placeholder="Select a service type"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {serviceTypes}
          </Select>)}
        </FormItem>
        <Button onClick={clickSearch} style={{ margin: '5px' }}>Search</Button>
        <Button type="danger" onClick={clickReset}>Reset</Button>
      </Col>
      <Col {...column} >
        { Object.keys(customerInfo).length > 0 && <Card {...cardProps}>{item}</Card> }
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  listPoliceNo: PropTypes.array,
  listServiceType: PropTypes.array,
  modalVisible: PropTypes.bool,
  customerInfo: PropTypes.object,
  openModal: PropTypes.func,
  onResetClick: PropTypes.func,
  resetHistory: PropTypes.func,
  onSearchClick: PropTypes.func,
}

export default Form.create()(Filter)
