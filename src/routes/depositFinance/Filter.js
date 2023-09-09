import { Checkbox, DatePicker, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

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
        {getFieldDecorator('transDate', {
          initialValue: (location && location.query && location.query.transDate)
            ? moment(location.query.transDate, 'YYYY-MM-DD')
            : moment()
        })(
          <DatePicker
            style={{ minWidth: '150px' }}
            allowClear={false}
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
