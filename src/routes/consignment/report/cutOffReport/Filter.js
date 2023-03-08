import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Button } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option

const Filter = ({
  period,
  loading,
  periodList,
  getData,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const periodOption = periodList.length > 0 ? periodList.map(record => (<Option key={record.id} value={record.period}>{moment(record.period).format('DD MMM YYYY')}</Option>)) : []

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      const fields = getFieldsValue()
      getData(fields)
    })
  }

  return (
    <Form layout="inline">
      <FormItem>
        {getFieldDecorator('period', {
          initialValue: period || undefined
        })(
          <Select placeholder="Pilih Periode" style={{ marginBottom: '10px', minWidth: '120px' }}>
            {periodOption}
          </Select>
        )}
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          onClick={() => handleSubmit()}
          loading={loading}
          disabled={!getFieldsValue().period}
        >Cari</Button>
      </FormItem>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object
}

export default Form.create()(Filter)
