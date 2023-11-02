import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Row, Col, DatePicker, Input } from 'antd'
import { FilterItem } from 'components'

const Search = Input.Search
const { RangePicker } = DatePicker

const Filter = ({
  onFilterChange,
  filter,
  show,
  onResetClick,
  handleInventory,
  inventoryMode,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue
  }
}) => {
  const handleFields = (fields) => {
    const { createTime } = fields
    if (createTime.length) {
      fields.createTime = [createTime[0].format('YYYY-MM-DD'), createTime[1].format('YYYY-MM-DD')]
    }
    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    onResetClick()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  const params = location.search.substring(1)
  let query = params ? JSON.parse(`{"${decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) : {}

  if (query.q) query.q = query.q.replace(/\+/g, ' ')

  const disabledDate = (current) => {
    return current > moment(new Date())
  }

  return (
    <Row gutter={24} style={{ display: show ? 'block' : 'none' }}>
      <Col xs={{ span: 24 }} sm={{ span: 9 }} md={{ span: 8 }} lg={6} style={{ marginBottom: 8 }}>
        {getFieldDecorator('q', { initialValue: query.q })(<Search placeholder="Search Name" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={9} style={{ marginBottom: 8 }}>
        <FilterItem label="Createtime" >
          {getFieldDecorator('createTime', { initialValue: initialCreateTime })(
            <RangePicker disabledDate={disabledDate} style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createTime')} />
          )}
        </FilterItem>
      </Col>
      <Col span={24} style={{ marginBottom: 8 }}>
        <div style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>Search</Button>
            <Button size="large" onClick={handleReset}>Reset</Button>
            {inventoryMode !== 'inventory' && <Button size="large" onClick={handleInventory}>Inventory Mode</Button>}
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  show: PropTypes.bool,
  onFilterChange: PropTypes.func,
  onResetClick: PropTypes.func
}

export default Form.create()(Filter)
