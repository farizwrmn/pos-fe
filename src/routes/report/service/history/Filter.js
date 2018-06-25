import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, DatePicker, Icon } from 'antd'
import moment from 'moment'
import { SelectItem } from 'components'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const leftColumn = {
  xs: 24,
  sm: 13,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 11,
  md: 12,
  lg: 12
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
        onSearchClickWithService(from, to, data.serviceType.option, data.employeeId.option, data.serviceCode.option)
      } else {
        onSearchClick(from, to, data.serviceType.option, data.employeeId.option)
      }
    })
  }

  const clickReset = () => {
    setFieldsValue({
      serviceType: {
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
        <Col {...leftColumn} >
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
            {getFieldDecorator('serviceType', {
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
          <FormItem label="Service Name" {...formItemLayout}>
            {getFieldDecorator('serviceCode', {
              valuePropName: 'value',
              rules: [{ required: false }]
            })(<SelectItem {...serviceNameProps} />)}
          </FormItem>
        </Col>
        <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
          <Button
            size="large"
            style={{ marginLeft: '5px' }}
            type="primary"
            className="button-width02 button-extra-large"
            onClick={() => clickSearch()}
          >
            <Icon type="search" className="icon-large" />
          </Button>
          <Button type="dashed"
            size="large"
            className="button-width02 button-extra-large bgcolor-lightgrey"
            onClick={() => clickReset()}
          >
            <Icon type="rollback" className="icon-large" />
          </Button>
          <PrintPDF {...printProps} />
          <PrintXLS {...printProps} />
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
