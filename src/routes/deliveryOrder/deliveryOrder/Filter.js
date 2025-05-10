import React from 'react'
import { Form, Row, Col, Select, Input, Button } from 'antd'
import { decrypt } from 'utils/crypt'

// const Search = Input.Search
const Option = Select.Option
const FormItem = Form.Item

const Filter = ({
  onFilter,
  loading,
  listAllStores,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const listStore = listAllStores
  const listStoreTarget = localStorage.getItem('tStoreUser') ? decrypt(localStorage.getItem('tStoreUser')) : []
  const storeData = listStore.filter(filtered => listStoreTarget.includes(filtered.value)).map(x => (<Option value={x.value}>{x.label}</Option>))
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const hdlSearch = () => {
    let field = getFieldsValue()
    if (!field.transNo) return null
    onFilter({ storeIdReceiver: field.storeIdReceiver, transNo: field.transNo })
  }

  return (
    <Row>
      <Col span={12}>
        <FormItem label="To Store" hasFeedback>
          {getFieldDecorator('storeIdReceiver', {
            initialValue: undefined,
            rules: [
              {
                required: true
              }
            ]
          })(<Select
            style={{ width: '100%' }}
            onChange={value => onFilter({ storeIdReceiver: value })}
            showSearch
            filterOption={filterOption}
          >
            {storeData}
          </Select>)}
        </FormItem>
        <Row>
          <FormItem label="Trans No" hasFeedback>
            {getFieldDecorator('transNo')(
              <Input
                placeholder="Search"
                onPressEnter={() => hdlSearch()}
              />
            )}
          </FormItem>
          <Button disabled={loading} onClick={() => hdlSearch()} type="primary" icon="search">Search</Button>
        </Row>
      </Col>
    </Row>
  )
}

export default Form.create()(Filter)
