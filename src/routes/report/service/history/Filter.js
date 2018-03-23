import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, DatePicker } from 'antd'
import moment from 'moment'
import { SelectItem } from 'components'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const formItemLayout = {
  labelCol: {
    xs: {
      span: 8
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
      span: 16
    },
    sm: {
      span: 14
    },
    md: {
      span: 14
    }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 10 },
  xl: { span: 10 }
}

const columnButton = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 4 },
  xl: { span: 4 }
}

const FormItem = Form.Item
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
    setFieldsValue
  }
}) => {
  const clickSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = { ...getFieldsValue() }
      let from = moment(data.period).startOf('month').format('YYYY-MM-DD')
      let to = moment(data.period).endOf('month').format('YYYY-MM-DD')
      if (data.serviceCode) {
        onSearchClickWithService(from, to, data.serviceTypeId.option, data.employeeId.option, data.serviceCode.option)
      } else {
        onSearchClick(from, to, data.serviceTypeId.option, data.employeeId.option)
      }
    })
  }

  const clickReset = () => {
    setFieldsValue({
      serviceTypeId: {
        option: []
      },
      employeeId: {
        option: []
      },
      serviceCode: {
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

  const employeeProps = {
    list: listEmployee,
    mode: 'multiple',
    componentKey: 'employeeId',
    componentValue: 'employeeName',
    allowClear: true,
    style: { width: 195, maxHeight: 80, overflow: 'scroll' },
    placeholder: 'Select employee name'
  }

  const serviceProps = {
    list: listServiceType,
    mode: 'multiple',
    componentKey: 'miscName',
    componentValue: 'miscDesc',
    allowClear: true,
    style: { width: 195, maxHeight: 80, overflow: 'scroll' },
    placeholder: 'Select service type'
  }

  const serviceNameProps = {
    list: listServices,
    mode: 'multiple',
    componentKey: 'serviceCode',
    componentValue: 'serviceName',
    allowClear: true,
    style: { width: 195, maxHeight: 80, overflow: 'scroll' },
    placeholder: 'Select service type'
  }

  return (
    <Row>
      <Form layout="horizontal">
        <Col {...column} >
          <FormItem label="Period" {...formItemLayout}>
            {getFieldDecorator('period', {
              rules: [
                {
                  required: true
                }
              ]
            })(<MonthPicker style={{ width: 195 }} />)}
          </FormItem>
          <FormItem label="Service Type" {...formItemLayout}>
            {getFieldDecorator('serviceTypeId', {
              valuePropName: 'value',
              rules: [
                {
                  required: true
                }
              ]
            })(<SelectItem {...serviceProps} />)}
          </FormItem>
          <FormItem label="Employee Name" {...formItemLayout}>
            {/* <SelectItem id="employeeId" {...employeeProps} /> */}
            {getFieldDecorator('employeeId', {
              valuePropName: 'value',
              rules: [{ required: true }]
            })(<SelectItem {...employeeProps} />)}
          </FormItem>
        </Col>
        <Col {...column} >
          <FormItem label="Service Name" {...formItemLayout}>
            {getFieldDecorator('serviceCode', {
              valuePropName: 'value',
              rules: [{ required: false }]
            })(<SelectItem {...serviceNameProps} />)}
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
      </Form>
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
  onResetClick: PropTypes.func
}

export default Form.create()(Filter)
