import { DatePicker } from 'antd'

const Filter = ({
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

  return (
    <DatePicker allowClear onChange={handleChange} />
  )
}

export default Filter
