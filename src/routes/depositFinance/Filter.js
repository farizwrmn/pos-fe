import { Checkbox, DatePicker, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const Filter = ({
  location,
  all,
  userRole,
  onChangeAllStore,
  onChangeTransDate,
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Form inline>
      <FormItem>
        {getFieldDecorator('rangeDate', {
          initialValue: (location && location.query && location.query.startDate && location.query.endDate)
            ? [moment(location.query.startDate, 'YYYY-MM-DD'), moment(location.query.endDate, 'YYYY-MM-DD')]
            : undefined
        })(
          <RangePicker
            style={{ minWidth: '150px' }}
            allowClear
            onChange={onChangeTransDate}
          />
        )}
      </FormItem>
      {userRole === 'OWN' && (
        <FormItem>
          {getFieldDecorator('all')(
            <Checkbox onChange={onChangeAllStore} checked={JSON.parse(all)}>All Store</Checkbox>
          )}
        </FormItem>
      )}
    </Form>
  )
}

export default Form.create()(Filter)
