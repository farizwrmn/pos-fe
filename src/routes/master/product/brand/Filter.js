import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Row, Col, DatePicker, Input } from 'antd'
import { FilterItem } from 'components'

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
  // isChecked,
  // display,
  // switchIsChecked,
  onFilterChange,
  filter,
  onResetClick,
  show,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue
  }
}) => {
  // const switchFilter = () => {
  //   switchIsChecked()
  // }
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields.brandName = fields.searchName
    delete fields.searchName
    if (fields.brandName === undefined || fields.brandName === '') {
      delete fields.brandName
    }
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
    // handleSubmit()
    onResetClick()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { brandName } = filter

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <Row gutter={24} style={{ display: show ? 'block' : 'none' }}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('searchName', { initialValue: brandName })(<Search placeholder="Search Name" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <FilterItem label="Createtime" >
          {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
            <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createTime')} />
          )}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
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
  show: PropTypes.bool,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onResetClick: PropTypes.func
}

export default Form.create()(Filter)
