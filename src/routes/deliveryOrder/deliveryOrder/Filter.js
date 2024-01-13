import React from 'react'
import { Form, Row, Col, Select } from 'antd'

// const Search = Input.Search
const Option = Select.Option
const FormItem = Form.Item

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

  const storeData = listStore.map(x => (<Option value={x.value}>{x.label}</Option>))

  return (
    <Row>
      <Col span={12}>
        <FormItem label="To Store" hasFeedback>
          {getFieldDecorator('storeIdReceiver', {
            initialValue: storeId,
            rules: [
              {
                required: true
              }
            ]
          })(<Select
            style={{ width: '100%' }}
            onChange={value => onFilter(value)}
          >
            {storeData}
          </Select>)}
        </FormItem>
      </Col>
    </Row>
  )
}

export default Form.create()(Filter)
