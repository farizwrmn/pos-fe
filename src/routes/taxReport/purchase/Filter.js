import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, DatePicker, Button, Icon } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const FormItem = Form.Item

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    let field = getFieldsValue()
    onFilterChange({
      from: field.rangeDate[0].format('YYYY-MM-DD'),
      to: field.rangeDate[1].format('YYYY-MM-DD')
    })
  }

  return (
    <Row>
      <Col span={12}>
        <FormItem>
          {getFieldDecorator('rangeDate', {
            initialValue: [moment().add('-1', 'months'), moment()],
            rules: [
              { required: true }
            ]
          })(
            <RangePicker allowClear={false} size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
      </Col>
      <Col {...searchBarLayout} >
        <Button
          type="primary"
          size="large"
          style={{ marginLeft: '5px', float: 'right' }}
          className="button-width02 button-extra-large"
          onClick={() => handleSubmit()}
        >
          <Icon type="search" className="icon-large" />
        </Button>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
