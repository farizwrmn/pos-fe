import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Row, Col, DatePicker, Input } from 'antd'
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

const Filter = ({
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleFields = (fields) => {
    const { period } = fields
    if (period.length) {
      fields.period = [period[0].format('YYYY-MM-DD'), period[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  let currentPeriod = []
  currentPeriod[0] = moment().startOf('month')
  currentPeriod[1] = moment()

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('searchName')(<Search placeholder="Search Name" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }}>
        <FilterItem label="Period" >
          {getFieldDecorator('period', { initialValue: currentPeriod })(
            <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'period')} />
          )}
        </FilterItem>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
