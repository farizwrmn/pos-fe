import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, DatePicker } from 'antd'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const Filter = ({
  dateRange,
  getData,
  changeTime,
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Form layout="inline">
      <FormItem>
        {getFieldDecorator('date', {
          initialValue: dateRange || null
        })(
          <RangePicker onChange={changeTime} />
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" onClick={() => getData()}>Cari</Button>
      </FormItem>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
