/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Row, Col, Icon, Form, message } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const FormItem = Form.Item

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

const Filter = ({ onDateChange, loading, onListReset, form: { getFieldValue, resetFields, getFieldDecorator }, ...printProps }) => {
  // const handleChange = (value) => {
  //   const from = moment(value, 'YYYY-MM').startOf('month').format('YYYY-MM-DD')
  //   const to = moment(value, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
  //   onDateChange(from, to)
  // }
  const handleSearch = () => {
    const dateString = getFieldValue('to')
    if (!dateString) {
      message.warning('Require Date')
      return
    }
    const to = moment(dateString).format('YYYY-MM-DD')
    onDateChange(to)
  }

  const handleReset = () => {
    resetFields()
  }

  return (
    <Row >
      <Col {...leftColumn} >
        <Form>
          <FormItem label="Trans Date">
            {getFieldDecorator('to')(
              <DatePicker size="large" style={{ width: '189px' }} />
            )}
          </FormItem>
        </Form>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          disabled={loading.effects['accountsReport/queryPayableTrans']}
          style={{ marginLeft: '5px' }}
          className="button-width02 button-extra-large"
          onClick={() => handleSearch()}
        >
          <Icon type="search" className="icon-large" />
        </Button>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          onClick={() => handleReset()}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
        {<PrintPDF {...printProps} />}
        {<PrintXLS {...printProps} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
