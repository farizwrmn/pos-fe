import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select } from 'antd'

const Option = Select.Option

const InputSearch = ({
  listCustomer,
  findItem,
  showItem,
  resetUnit,
  filter,
  disableInputSearch,
  form: {
    getFieldDecorator,
  },
}) => {
  const { memberCode } = filter
  let member
  const data = []
  listCustomer.forEach((d) => {
    data.push({
      memberCode: d.memberCode,
      memberName: d.memberName,
    })
  })
  member = data.map(customer => <Option value={customer.memberName} title={customer.memberCode} key={customer.memberCode}>{customer.memberName}</Option>)
  const handleChage = (name) => {
    findItem(name)
    if (name === '') {
      resetUnit()
    }
  }

  const handleSelect = (value, context) => {
    showItem(context.props.title)
  }

  return (
    <Row>
      <Col>
        {getFieldDecorator('memberCode', { initialValue: memberCode })(
          <Select style={{ width: 200 }}
            mode="combobox"
            disabled={disableInputSearch}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onChange={handleChage}
            placeholder="Find member name"
            onSelect={handleSelect}
          >
            {member}
          </Select>
        )}
      </Col>
    </Row>
  )
}

InputSearch.propTypes = {
  form: PropTypes.object.isRequired,
  listCustomer: PropTypes.object,
  findItem: PropTypes.func,
  showItem: PropTypes.func,
}

export default Form.create()(InputSearch)

