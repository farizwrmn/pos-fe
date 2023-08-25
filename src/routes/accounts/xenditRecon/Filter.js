import { DatePicker } from 'antd'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker

const Filter = ({
  location,
  removeTransDate,
  onDateChange
}) => {
  const handleChange = (value) => {
    if (value.length <= 0) {
      removeTransDate()
      return
    }

    onDateChange(value)
  }

  const { from, to } = location.query
  const defaultValue = from && to ? [moment(from, 'YYYY-MM-DD'), moment(to, 'YYYY-MM-DD')] : undefined

  return (
    <RangePicker
      value={defaultValue}
      allowClear
      onChange={handleChange}
    />
  )
}

export default Filter
