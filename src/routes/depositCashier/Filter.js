import { DatePicker, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const Filter = ({
  location,
  handleChangeDate,
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Form inline>
      <FormItem>
        {getFieldDecorator('rangeDate', {
          initialValue: (location
            && location.query
            && location.query.startDate
            && location.query.endDate)
            ? [moment(location.query.startDate, 'YYYY-MM-DD'), moment(location.query.endDate, 'YYYY-MM-DD')]
            : undefined
        })(
          <RangePicker
            onChange={handleChangeDate}
          />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
