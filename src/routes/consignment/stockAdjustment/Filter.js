import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input } from 'antd'

const Search = Input.Search
const FormItem = Form.Item

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  q,
  onFilterChange,
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Row>
      <Col span={12} />
      <Col {...searchBarLayout} >
        <FormItem >
          {getFieldDecorator('q', {
            initialValue: q
          })(
            <Search
              placeholder="Cari stock adjustment Id"
              onSearch={(value) => { onFilterChange(value) }}
            />
          )}
        </FormItem>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
