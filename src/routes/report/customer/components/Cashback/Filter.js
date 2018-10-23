import React from 'react'
import PropTypes from 'prop-types'
import { Button, Checkbox, Row, Col, Form, message, DatePicker, Card } from 'antd'
import moment from 'moment'
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
  sm: 8,
  md: 8,
  lg: 8,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8
}

const FormItem = Form.Item
const { RangePicker } = DatePicker

const Filter = ({
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
  const printOpts = {
    customerInfo,
    ...printProps
  }
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
      const data = {
        ...getFieldsValue()
      }

      const { id } = customerInfo
      if (!id) {
        message.warning('customer information not found')
      }
      if (data.expired) {
        data.expirationDate = moment().format('YYYY-MM-DD')
      }

      data.memberId = id
      if (data.posDate) {
        data.posDate = data.posDate.map(x => moment(x).format('YYYY-MM-DD'))
      }
      data.type = 'all'
      data.expired = null
      onSearchClick(data)
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
    onResetClick()
    openModal()
  }

  const { item } = cardProps

  return (
    <Form>
      <Row>
        <Col {...leftColumn} >
          <FormItem label="Member Code" {...formItemLayout}>
            <Button type="primary" onClick={hdlOpenModal}>Find Customer</Button>
            {showCustomer && <ModalBrowse {...modalProps} />}
          </FormItem>
          <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('posDate', {
              rules: [{
                required: true
              }]
            })(<RangePicker style={{ width: 195 }} />)}
          </FormItem>
          <FormItem label="Not Expired" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expired', {
              valuePropName: 'checked',
              initialValue: true,
              rules: [{
                required: true
              }]
            })(<Checkbox style={{ width: 195 }} />)}
          </FormItem>
          <Button onClick={clickSearch} style={{ margin: '5px' }}>Search</Button>
          <Button type="danger" onClick={clickReset}>Reset</Button>
        </Col>
        <Col {...rightColumn}>
          {Object.keys(customerInfo).length > 0 &&
            <Card {...cardProps}>
              {item}
            </Card>}
        </Col>
        <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
          <PrintPDF {...printOpts} />
          <PrintXLS {...printOpts} />
        </Col>
      </Row>
    </Form>
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
