import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Select } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const { Option } = Select

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  item,
  onFilterChange,
  listAllStores,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = (storeId) => {
    let field = getFieldsValue()
    if (storeId) {
      field.storeId = storeId
    }
    onFilterChange(field)
  }

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option title={`${x.storeName} (${x.storeCode})`} key={x.id}>{`${x.storeName} (${x.storeCode})`}</Option>)) : []

  return (
    <Row>
      <Col span={12}>
        <FormItem>
          {getFieldDecorator('storeId')(
            <Select
              style={{ width: 245 }}
              placeholder="Select Store"
              onChange={storeId => handleSubmit(storeId)}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {childrenTransNo}
            </Select>)}
        </FormItem>
      </Col>
      <Col {...searchBarLayout} >
        <FormItem >
          {getFieldDecorator('q', {
            initialValue: item.q
          })(
            <Search
              placeholder="Search"
              onSearch={() => handleSubmit()}
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
