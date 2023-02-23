import React from 'react'
import { Form, Select, Button, DatePicker, Col } from 'antd'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker
const Option = Select.Option

const columnProps = {
  xs: 24,
  sm: 24,
  md: 8,
  lg: 8
}

const tailColumnProps = {
  xs: 24,
  sm: 24,
  md: 2,
  lg: 2
}

const Filter = ({
  dateRange,
  balanceList,
  selectedBalance,
  onChangeDate,
  getData,
  updateCurrentBalance,
  form: {
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
        getData(moment(dateRange[0]).format('YYYY-MM-DD'), moment(dateRange[1]).format('YYYY-MM-DD'))
      }
    })
  }

  const handleChangeDate = (value) => {
    onChangeDate(value)
  }

  const handleChangeBalance = (value) => {
    updateCurrentBalance(value)
  }

  return (
    <Col span={24} style={{ marginBottom: '10px' }}>
      <Form layout="inline">
        <Col {...columnProps}>
          <RangePicker style={{ width: '95%' }} onChange={handleChangeDate} />
        </Col>
        <Col {...columnProps}>
          <Select
            placeholder="Pilih Balance Id"
            style={{ width: '95%' }}
            filterOption={false}
            onChange={handleChangeBalance}
            disabled={!dateRange}
          >
            {balanceOption}
          </Select>
        </Col>
        <Col {...tailColumnProps}>
          <Button style={{ width: '95%' }} type="primary" onClick={() => handleSubmit()} disabled={!dateRange}>Cari</Button>
        </Col>
      </Form>
    </Col>
  )
}

export default Form.create()(Filter)
