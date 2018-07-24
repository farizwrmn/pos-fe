import React from 'react'
import PropTypes from 'prop-types'
import { Input, Row, Col } from 'antd'

const Search = Input.Search
const column = {
  xs: { span: 24 },
  sm: { span: 7 },
  md: { span: 6 },
  lg: { span: 5 }
}

const Filter = ({
  findCashier
}) => {
  return (
    <Row>
      <Col {...column}>
        <Search placeholder="Search Cashier" onSearch={value => findCashier(value)} />
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  filterByDate: PropTypes.func
}

export default Filter
