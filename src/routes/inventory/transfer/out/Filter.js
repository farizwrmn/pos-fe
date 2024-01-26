import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Switch } from 'antd'

const Search = Input.Search
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16
  }
}

const TwoColProps = {
  ...ColProps,
  xl: 96
}

const Filter = ({
  isChecked,
  display,
  switchIsChecked,
  onFilterChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue
  }
}) => {
  const switchFilter = () => {
    switchIsChecked()
  }
  const handleFields = (fields) => {
    const { createdAt } = fields
    if (createdAt.length) {
      fields.createdAt = [createdAt[0].format('YYYY-MM-DD'), createdAt[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields.cityName = fields.searchName
    fields = handleFields(fields)
    onFilterChange(fields)
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
    handleSubmit()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { cityName } = filter

  let initialCreateTime = []
  if (filter.createdAt && filter.createdAt[0]) {
    initialCreateTime[0] = moment(filter.createdAt[0])
  }
  if (filter.createdAt && filter.createdAt[1]) {
    initialCreateTime[1] = moment(filter.createdAt[1])
  }

  return (
    <Row gutter={24}>
      <div>
        <Switch style={{ marginRight: 16, marginBottom: 16 }} size="large" defaultChecked={isChecked} onChange={switchFilter} checkedChildren={'Open'} unCheckedChildren={'Hide'} />
      </div>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('searchName', { initialValue: cityName })(<Search placeholder="Search Name" size="large" onSearch={handleSubmit} style={{ display }} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }} style={{ display }}>
        <FilterItem label="Createtime" >
          {getFieldDecorator('createdAt', { initialValue: initialCreateTime })(
            <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createdAt')} />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ display, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>Search</Button>
            <Button size="large" onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  isChecked: PropTypes.bool,
  switchIsChecked: PropTypes.func,
  form: PropTypes.object,
  display: PropTypes.string,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
