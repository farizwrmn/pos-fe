import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'

const Filter = ({
  filterByDate
}) => {
  const handleChangeDate = (date, dateString) => {
    filterByDate(dateString)
  }

  return (
    <DatePicker onChange={handleChangeDate} placeholder="Select Trans Date" />
  )
}

Filter.propTypes = {
  filterByDate: PropTypes.func
}

export default Filter
