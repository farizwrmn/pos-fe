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
  const currentDate = moment()
  const rangeDateDefaultValue = (location
    && location.query
    && location.query.startDate
    && location.query.endDate)
    ? [
      moment(location.query.startDate, 'YYYY-MM-DD'),
      moment(location.query.endDate, 'YYYY-MM-DD')
    ] : [currentDate, currentDate]

  return (
    <Form inline>
      <FormItem>
        {getFieldDecorator('rangeDate', {
          initialValue: rangeDateDefaultValue,
          rules: [
            {
              required: true,
              message: 'Required!'
            }
          ]
        })(
          <RangePicker
            allowClear={false}
            onChange={handleChangeDate}
          />
        )}
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
