import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, DatePicker, Card } from 'antd'
import { SelectItem } from 'components'
import ModalBrowse from './Modal'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const formItemLayout = {
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 14 }
  }
}

const leftColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12
}

const FormItem = Form.Item
const { RangePicker } = DatePicker

const Filter = ({
  listPoliceNo,
  listServiceType,
  showCustomer,
  customerInfo,
  openModal,
  onResetClick,
  onSearchClick,
  ...modalProps,
  ...printProps,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields,
    setFieldsValue
  }
}) => {
  const clickReset = () => {
    setFieldsValue({
      serviceType: {
        option: []
      },
      policeNo: {
        option: []
      }
    })
    let timeout
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(() => {
      resetFields()
    }, 200)
    onResetClick()
  }

  const clickSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = { ...getFieldsValue() }
      data.policeNo = data.policeNo.option
      data.serviceType = data.serviceType ? data.serviceType.option : null
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
    )
  }

  const hdlOpenModal = () => {
    setFieldsValue({
      serviceType: {
        option: []
      },
      policeNo: {
        option: []
      }
    })
    let timeout
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(() => {
      resetFields()
    }, 200)
    onResetClick()
    openModal()
  }

  const { item } = cardProps

  const getPoliceNoId = (list) => {
    list = list.filter((thing, index, self) =>
      index === self.findIndex(t => (
        t.id === thing.id
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
    style: { width: 195, overflow: 'scroll' },
    placeholder: 'Select a plat'
  }
  const serviceTypeProps = {
    list: listServiceType,
    mode: 'multiple',
    componentKey: 'miscName',
    componentValue: 'miscDesc',
    allowClear: true,
    style: { width: 195, overflow: 'scroll' },
    placeholder: 'Select service type'
  }

  return (
    <Row>
      <Col {...leftColumn} >
        <FormItem label="Member Code" {...formItemLayout}>
          <Button type="primary" onClick={hdlOpenModal} >Find Customer</Button>
          {showCustomer && <ModalBrowse {...modalProps} />}
        </FormItem>
        <FormItem label="Period" {...formItemLayout}>
          {getFieldDecorator('period')(<RangePicker style={{ width: 195 }} />)}
        </FormItem>
        <FormItem label="Police No" {...formItemLayout}>
          {getFieldDecorator('policeNo', {
            rules: [{ required: true }]
          })(<SelectItem {...policeNoProps} />)}
        </FormItem>
        <FormItem label="Service Type" {...formItemLayout}>
          {getFieldDecorator('serviceType')(
            <SelectItem {...serviceTypeProps} />
          )}
        </FormItem>
        <Button onClick={clickSearch} style={{ margin: '5px' }}>Search</Button>
        <Button type="danger" onClick={clickReset}>Reset</Button>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <PrintPDF {...printProps} />
        <PrintXLS {...printProps} />
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
  onSearchClick: PropTypes.func
}

export default Form.create()(Filter)
