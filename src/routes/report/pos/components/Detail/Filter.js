import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker

const leftColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12
}

const Filter = ({
  onDateChange,
  onListReset,
  form: {
    resetFields,
    getFieldDecorator
  },
  ...printProps
}) => {
  const handleChangeDate = (value) => {
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to)
  }

  const handleReset = () => {
    resetFields()
    onListReset()
  }

  return (
    <Row>
      <Col {...leftColumn}>
        <FilterItem label="Trans Date">
          {getFieldDecorator('period')(
            <RangePicker size="large" onChange={value => handleChangeDate(value)} format="DD-MMM-YYYY" />
          )}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ textAlign: 'right' }}>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          onClick={() => handleReset()}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
        <PrintPDF {...printProps} />
        <PrintXLS {...printProps} />
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  onListReset: PropTypes.func,
  onDateChange: PropTypes.func
}

export default Form.create()(Filter)
