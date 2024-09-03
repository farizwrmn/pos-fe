import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Select } from 'antd'

const Search = Input.Search
const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  onFilterChange,
  listStore,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const childrenStore = listStore && listStore.length > 0 ? listStore.map(x => (<Option value={x.value} key={x.value} title={x.label}>{x.label}</Option>)) : []

  const handleSubmit = () => {
    let field = getFieldsValue()
    if (field.q === undefined || field.q === '') delete field.q
    onFilterChange(field)
  }

  const onSelectStore = (storeIdReceiver) => {
    let field = {
      ...getFieldsValue()
    }
    field.storeIdReceiver = storeIdReceiver
    onFilterChange(field)
  }

  return (
    <Row>
      <Col {...searchBarLayout} >
        <FormItem label="Search" hasFeedback {...formItemLayout} >
          {getFieldDecorator('q')(
            <Search
              placeholder="Search"
              onSearch={() => handleSubmit()}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('storeIdReceiver')(
            <FormItem label="Store Target" hasFeedback {...formItemLayout} >
              {getFieldDecorator('storeIdReceiver', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  showSearch
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Choose Store Target"
                  onSelect={onSelectStore}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {childrenStore}
                </Select>
              )}
            </FormItem>
          )}
        </FormItem>
      </Col>
      <Col span={12} />
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
