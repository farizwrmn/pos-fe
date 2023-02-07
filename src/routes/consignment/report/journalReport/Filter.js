import React from 'react'
import { Form, Select, Button, DatePicker } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const Filter = ({
  dateRange,
  balanceList,
  selectedBalance,
  onChangeDate,
  getData,
  updateCurrentBalance,
  form: {
    getFieldDecorator,
    validateFields
  }
}) => {
  const balanceOption = balanceList.length > 0 ? balanceList.map(record => (<Option key={record.id} value={record.id}>{record['approveUser.userName']} || {moment(record.open).format('DD MMM YYYY | hh:mm:ss')} - {moment(record.closed).format('DD MMM YYYY | hh:mm:ss')}</Option>)) : []

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }
      if (selectedBalance && selectedBalance.id) {
        getData(moment(selectedBalance.open).format('YYYY-MM-DD HH:mm:SS'), moment(selectedBalance.closed).format('YYYY-MM-DD HH:mm:SS'))
      } else {
        getData(moment(dateRange[0]).format('YYYY-MM-DD HH:mm:SS'), moment(dateRange[1]).format('YYYY-MM-DD HH:mm:SS'))
      }
    })
  }

  const handleChangeDate = (value) => {
    onChangeDate(value)
  }

  const handleChangeBalance = (value) => {
    updateCurrentBalance(value)
  }

  let dateRangeProps = {
    rules: [
      {
        required: true
      }
    ]
  }
  if (dateRange) {
    dateRangeProps = {
      ...dateRangeProps,
      initialValue: dateRange
    }
  }

  let balanceProps = {}
  if (selectedBalance) {
    balanceProps = {
      ...balanceProps,
      initialValue: selectedBalance.id
    }
  }


  return (
    <Form layout="inline">
      <FormItem>
        {getFieldDecorator('date', dateRangeProps
        )(
          <RangePicker onChange={handleChangeDate} />
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('balance', balanceProps
        )(
          <Select
            placeholder="Pilih Balance Id"
            style={{ marginBottom: '10px', minWidth: '450px' }}
            filterOption={false}
            onChange={handleChangeBalance}
          >
            {balanceOption}
          </Select>
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" onClick={() => handleSubmit()}>Cari</Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(Filter)
