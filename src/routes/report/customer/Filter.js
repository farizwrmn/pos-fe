import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, DatePicker, Card } from 'antd'
import ModalBrowse from './Modal'
import { SelectItem } from 'components'

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
      data.policeNo = data.policeNo.option
      data.serviceTypeId = data.serviceTypeId.option
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

  const getPoliceNoId = (list) => {
    list = list.filter((thing, index, self) =>
      index === self.findIndex(t => (
        t.policeNoId === thing.policeNoId
      ))
    )
    return list
  }
  const policeNoProps = {
    list: getPoliceNoId(listPoliceNo),
    mode: 'multiple',
    componentKey: 'policeNo',
    componentValue: 'policeNo',
    allowClear: true,
    style: { width: 195, maxHeight: 80, overflow: 'scroll' },
    placeholder: 'Select a plat',
  }
  const serviceTypeProps = {
    list: listServiceType,
    mode: 'multiple',
    componentKey: 'miscName',
    componentValue: 'miscDesc',
    allowClear: true,
    style: { width: 195, maxHeight: 80, overflow: 'scroll' },
    placeholder: 'Select service type',
  }

  return (
    <Row>
      <Col {...column} >
        <FormItem label="Member Code" {...formItemLayout}>
          <Button type="primary" onClick={openModal} >Find Customer</Button>
          {modalVisible && <ModalBrowse {...modalProps} />}
        </FormItem>
        <FormItem label="Period" {...formItemLayout}>
          {getFieldDecorator('period')(<RangePicker style={{ width: 195 }} />)}
        </FormItem>
        <FormItem label="Police No" {...formItemLayout}>
          {getFieldDecorator('policeNo', {
            rules: [{ required: true }],
          })(<SelectItem {...policeNoProps} />)}
        </FormItem>
        <FormItem label="Service Type" {...formItemLayout}>
          {getFieldDecorator('serviceTypeId')(
            <SelectItem {...serviceTypeProps} />
          )}
        </FormItem>
        <Button onClick={clickSearch} style={{ margin: '5px' }}>Search</Button>
        <Button type="danger" onClick={clickReset}>Reset</Button>
      </Col>
      <Col {...column} >
        {Object.keys(customerInfo).length > 0 && <Card {...cardProps}>{item}</Card>}
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
