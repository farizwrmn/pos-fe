import { DatePicker } from 'antd'
import moment from 'moment'

const Filter = ({
  location,
  removeTransDate,
  onDateChange
}) => {
  const handleChange = (value) => {
    if (!value) {
      removeTransDate()
      return
    }

    onDateChange(value)
  }

  const { query } = location
  const { transDate = null } = query

  const defaultDate = transDate ? moment(transDate, 'YYYY-MM-DD') : null

  return (
    <DatePicker
      value={defaultDate}
      allowClear
      onChange={handleChange}
    />
  )
}

export default Filter
