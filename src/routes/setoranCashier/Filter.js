import { DatePicker, Form, Input } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const Filter = ({
  location,
  onChangeDate,
  onSearch,
  form: {
    getFieldDecorator,
    getFieldValue
  }
}) => {
  const { from, to, q } = location.query

  const handleSearch = () => {
    const q = getFieldValue('q')

    if (q != null) {
      onSearch(q)
    }
  }

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
      <FormItem>
        {getFieldDecorator('q', {
          initialValue: q != null ? q : undefined
        })(
          <Input
            placeholder="Search Here!"
            onPressEnter={handleSearch}
            style={{ minWidth: '250px' }}
          />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
