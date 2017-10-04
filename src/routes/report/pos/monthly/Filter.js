/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, DatePicker, Row, Col, Icon } from 'antd'

const ButtonGroup = Button.Group

const {RangePicker} = DatePicker

const Filter = ({ onFilterChange, onDateChange, form: { getFieldsValue, setFieldsValue } }) => {


  const handleChange = (value) => {
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to)
  }

  return (
    <div>
        <FilterItem style={{ width: '100%' }} label="Trans Date">
          <RangePicker size="large" onChange={(value) => handleChange(value)} />
        </FilterItem>
        {/*// <div>*/}
          {/*/!*<Button type="primary" size="small" className="margin-bottom" onClick={handleReset}>Reset</Button>*!/*/}
        {/*/!*</div>*!/*/}
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
