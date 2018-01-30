import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Select, DatePicker, message } from 'antd'
import moment from 'moment'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

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
  lg: { span: 10 },
  xl: { span: 10 },
}

const columnButton = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 4 },
  xl: { span: 4 },
}

const FormItem = Form.Item
const Option = Select.Option
const { MonthPicker } = DatePicker

const Filter = ({
  ...printProps,
  listServiceType,
  listEmployee,
  listServices,
  onSearchClick,
  onSearchClickWithService,
  onResetClick,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields,
  },
}) => {
  const serviceTypes = listServiceType.length > 0 ? listServiceType.map(service => (<Option value={service.miscName}>{service.miscDesc}</Option>)) : []
  const employees = listEmployee.length > 0 ? listEmployee.map(employee => (<Option value={employee.employeeId}>{employee.employeeName}</Option>)) : []
  const services = listServices.length > 0 ? listServices.map(service => (<Option value={service.serviceCode}>{service.serviceName}</Option>)) : []
  const data = { ...getFieldsValue() }

  if (data.period === undefined) {
    data.period = ''
  }

  if (data.serviceTypeId === undefined) {
    data.serviceTypeId = []
  }

  if (data.employeeId === undefined) {
    data.employeeId = []
  }

  if (data.serviceCode === undefined) {
    data.serviceCode = []
  }

  const checkService = () => {
    if (data.period === '' || data.serviceTypeId.length === 0 || data.employeeId.length === 0) {
      message.info('Please fill the Period, Service Type, and Employee Name first', 5)
    }
  }

  const clickSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let from = moment(data.period).startOf('month').format('YYYY-MM-DD')
      let to = moment(data.period).endOf('month').format('YYYY-MM-DD')
      if (data.serviceCode.length === 0) {
        onSearchClick(from, to, data.serviceTypeId, data.employeeId)
      } else {
        onSearchClickWithService(from, to, data.serviceTypeId, data.employeeId, data.serviceCode)
      }
    })
  }

  const clickReset = () => {
    resetFields()
    onResetClick()
  }

  return (
    <Row>
      <Col {...column} >
        <FormItem label="Period" {...formItemLayout}>
          {getFieldDecorator('period', {
            rules: [
              {
                required: true,
              },
            ],
          })(<MonthPicker style={{ width: 195 }} />)}
        </FormItem>
        <FormItem label="Service Type" {...formItemLayout}>
          {getFieldDecorator('serviceTypeId', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            mode="multiple"
            style={{ width: 195 }}
            placeholder="Select service types"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {serviceTypes}
          </Select>)}
        </FormItem>
        <FormItem label="Employee Name" {...formItemLayout}>
          {getFieldDecorator('employeeId', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            mode="multiple"
            style={{ width: 195 }}
            placeholder="Select employee names"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {employees}
          </Select>)}
        </FormItem>
      </Col>
      <Col {...column} >
        <FormItem label="Service Name" {...formItemLayout}>
          {getFieldDecorator('serviceCode')(<Select
            mode="multiple"
            style={{ width: 195 }}
            onFocus={checkService}
            placeholder="Select service names"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {services}
          </Select>)}
        </FormItem>
      </Col>
      <Col {...columnButton} >
        <Col span={24} style={{ margin: '2.5px 0' }}>
          <Button style={{ width: 80 }} onClick={clickSearch}>Search</Button>
        </Col>
        <Col span={24} style={{ margin: '2.5px 0' }}>
          <Button type="danger" style={{ width: 80 }} onClick={clickReset}>Reset</Button>
        </Col>
        <Col span={24} style={{ margin: '3px 0' }}>
          <PrintPDF {...printProps} />
          <PrintXLS {...printProps} />
        </Col>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  listServiceType: PropTypes.array,
  listEmployee: PropTypes.array,
  listServices: PropTypes.array,
  onSearchClick: PropTypes.func,
  onSearchClickWithService: PropTypes.func,
  onResetClick: PropTypes.func,
}

export default Form.create()(Filter)
