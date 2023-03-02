import React from 'react'
import { Form, Button, DatePicker, Col } from 'antd'

const RangePicker = DatePicker.RangePicker

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
  loading,
  dateRange,
  getData,
  changeTime
}) => {
  return (
    <Col span={24} style={{ marginBottom: '10px' }}>
      <Form layout="inline">
        <Col {...columnProps}>
          <RangePicker
            onChange={changeTime}
            style={{ width: '95%', marginBottom: '10px' }}
            value={dateRange}
          />
        </Col>
        <Col {...tailColumnProps}>
          <Button
            type="primary"
            onClick={() => getData()}
            disabled={!dateRange.length > 0}
            style={{ width: '95%', marginBottom: '10px' }}
            loading={loading}
          >
            Cari
          </Button>
        </Col>
      </Form>
    </Col>
  )
}

export default Form.create()(Filter)
