import React from 'react'
import { Input, Row, Col, Button, Form } from 'antd'

const Search = Input.Search
const FormItem = Form.Item

const Filter = ({ onSearchByKeyword, onResetFilter, form: { getFieldDecorator, resetFields } }) => {
  const searchName = (keyword) => {
    if (keyword && keyword !== '') onSearchByKeyword(keyword)
    else onResetFilter()
  }

  const resetFilter = () => {
    onResetFilter()
    resetFields()
  }

  return (
    <Row>
      <Col xs={0} sm={13} md={14} lg={17} />
      <Col xs={17} sm={8} md={7} lg={5}>
        <FormItem>
          {getFieldDecorator('keyword')(
            <Search placeholder="Search..." size="large" onSearch={searchName} />
          )}
        </FormItem>

      </Col>
      <Col xs={7} sm={3} md={3} lg={2}>
        <Button style={{ float: 'right' }} size="large" onClick={resetFilter}>Reset</Button>
      </Col>
    </Row>
  )
}

export default Form.create()(Filter)
