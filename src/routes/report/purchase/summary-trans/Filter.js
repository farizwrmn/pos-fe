/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, DatePicker } from 'antd'

const {RangePicker} = DatePicker

const Filter = ({ onListReset, onFilterChange, onDateChange, form: { getFieldsValue, setFieldsValue } }) => {
  const handleReset = () => {
    onListReset()
  }

  const handleChange = (value) => {
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to)
  }

  return (
    <div>
        <FilterItem label="CreatedAt">
          <RangePicker style={{ width: '100%' }} size="large" onChange={(value) => handleChange(value)} />
        </FilterItem>
          <div>
            <Button type="primary" size="small" className="margin-right" onClick={handleReset}>Reset</Button>
          </div>
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onListReset: PropTypes.func,
}

export default Form.create()(Filter)
