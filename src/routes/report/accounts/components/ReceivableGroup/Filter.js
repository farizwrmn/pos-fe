/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Row, Select, Col, Icon, Form, Input } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const Option = Select.Option
const FormItem = Form.Item

const { MonthPicker } = DatePicker

const Filter = ({ onDateChange, listGroup, showCustomerGroup, onListReset, form: { getFieldsValue, setFieldsValue, validateFields, resetFields, getFieldDecorator },
  childrenGroup = (listGroup || []).map(group => <Option value={group.id} key={group.id}>{group.groupName}</Option>),
  ...printProps
}) => {
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 9
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
        span: 15
      },
      sm: {
        span: 16
      },
      md: {
        span: 14
      }
    }
  }
  const handleChange = () => {
    validateFields((errors) => {
      if (errors) return
      const data = getFieldsValue()
      // const to = value[1].format('YYYY-MM-DD')
      data.period = data.date.format('M')
      data.year = data.date.format('Y')
      onDateChange(data)
    })
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    resetFields()
    onListReset()
  }

  const customerGroup = () => {
    showCustomerGroup()
  }
  return (
    <div>
      <Row>
        <Col lg={10} md={24} >
          <FormItem label="Periode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('date', {
              rules: [{ required: true }]
            })(
              <MonthPicker size="large" />
            )}
          </FormItem>
        </Col>
        <Col lg={14} md={24} style={{ float: 'right', textAlign: 'right' }}>
          <Button
            type="dashed"
            size="large"
            style={{ marginLeft: '5px' }}
            className="button-width02 button-extra-large"
            onClick={handleChange}
          >
            <Icon type="search" className="icon-large" />
          </Button>
          <Button type="dashed"
            size="large"
            className="button-width02 button-extra-large bgcolor-lightgrey"
            onClick={() => handleReset()}
          >
            <Icon type="rollback" className="icon-large" />
          </Button>
          {<PrintPDF {...printProps} />}
          {<PrintXLS {...printProps} />}
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={24} >
          <FormItem label="Member Group" hasFeedback {...formItemLayout}>
            {getFieldDecorator('memberGroupId', {
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Select
                style={{ width: '189px', height: '32px' }}
                mode="multiple"
                showSearch
                autoFocus
                placeholder="Select Member Group Name"
                optionFilterProp="children"
                allowClear
                onFocus={customerGroup}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >{childrenGroup}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col lg={10} md={24} >
          <FormItem label="Member Name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('memberName')(
              <Input onPressEnter={handleChange} />
            )}
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
