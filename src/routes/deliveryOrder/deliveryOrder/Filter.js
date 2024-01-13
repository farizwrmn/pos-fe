import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Select } from 'antd'

// const Search = Input.Search
const Option = Select.Option
const FormItem = Form.Item

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  onFilter,
  storeId,
  listStore,
  form: {
    getFieldDecorator
    // getFieldsValue
  }
}) => {
  // const handleSubmit = () => {
  //   let field = getFieldsValue()
  //   if (!field.storeIdReceiver) return null
  //   onFilter(field.storeIdReceiver)
  // }

  const storeData = (listStore || []).length > 0 ?
    listStore.map(store => <Option title={`${store.sellingStore.address01}`} value={store.sellingStore.id} key={store.sellingStore.id}>{store.sellingStore.storeName}</Option>)
    : []

  return (
    <Row>
      <Col span={12} />
      <Col {...searchBarLayout} >
        <FormItem label="To Store" hasFeedback>
          {getFieldDecorator('storeIdReceiver', {
            initialValue: storeId,
            rules: [
              {
                required: true
              }
            ]
          })(<Select
            onChange={value => onFilter(value)}
          >
            {storeData}
          </Select>)}
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
