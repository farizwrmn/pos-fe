import { Button, DatePicker, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const Filter = ({
  location,
  loading,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const rangeDateDefaultValue = (location
    && location.query
    && location.query.startDate
    && location.query.endDate)
    ? [
      moment(location.query.startDate, 'YYYY-MM-DD'),
      moment(location.query.endDate, 'YYYY-MM-DD')
    ] : []

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) return error

      const data = {
        ...getFieldsValue()
      }

      onSubmit(data)
    })
  }

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
          <RangePicker />
        )}
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading.effects['depositCashier/queryBalanceList']
            || loading.effects['depositCashier/queryAdd']}
          disabled={loading.effects['depositCashier/queryBalanceList']}
        >
          Filter
        </Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
