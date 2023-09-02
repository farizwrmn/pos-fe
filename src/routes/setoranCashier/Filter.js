import { DatePicker, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const Filter = ({
  location,
  onChangeDate,
  form: {
    getFieldDecorator
  }
}) => {
  const { from, to } = location.query
  const handleChangeDate = (dateRange) => {
    if (Array.isArray(dateRange) && dateRange.length > 0) {
      onChangeDate(dateRange)
    }
  }

  return (
    <Form inline style={{ display: 'flex' }}>
      <FormItem style={{ flex: 1 }}>
        {getFieldDecorator('dateRange', {
          initialValue: (from != null && to != null) ? [moment(from, 'YYYY-MM-DD'), moment(to, 'YYYY-MM-DD')] : undefined
        })(
          <RangePicker
            onChange={handleChangeDate}
            format="DD MMM YYYY"
          />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
