import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Input, Collapse } from 'antd'

const Search = Input.Search
const { RangePicker } = DatePicker
const Panel = Collapse.Panel

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const Filter = ({
  onFilterChange,
  onSearchHide,
  visiblePanel = false,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields
  },
}) => {
  const handleFields = (fields) => {
    const { createdAt, customSearch } = fields
    let finalObj = {}
    let tempText = []
    if (customSearch) {
      // samadengan="page=1&pageSize=5"
      tempText[0]=customSearch.split('&')
      for (let i in tempText[0]) {
        console.log(tempText[0][i])
        tempText[1]=tempText[0][i].split('=')
        tempText[2]='{"'+tempText[1][0]+'":"'+tempText[1][1]+'"}'
        console.log(typeof tempText[2], 'tempText[2]',tempText[2])
        console.log(JSON.parse(tempText[2]))
        finalObj = Object.assign(finalObj,JSON.parse(tempText[2]))
      }
      fields = finalObj
    } else {
      if (createdAt.length) {
        fields.createdAt = [createdAt[0].format('YYYY-MM-DD'), createdAt[1].format('YYYY-MM-DD')]
      }
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
    console.log('setfield', fields)
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleClose = () => {
    onSearchHide()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }
  const { name, customSearch } = filter

  let initialCreateTime = []
  if (filter.createdAt && filter.createdAt[0]) {
    initialCreateTime[0] = moment(filter.createdAt[0])
  }
  if (filter.createdAt && filter.createdAt[1]) {
    initialCreateTime[1] = moment(filter.createdAt[1])
  }
  let initialCustomSearch = ''
  const collapseStyle={
    show: {display: 'block'},
    hide: {display: 'none'}
  }

  return (
    <Collapse defaultActiveKey={['1']} style={ visiblePanel ? collapseStyle.show : collapseStyle.hide}>
      <Panel header="Search" key="1">
        <Row gutter={24}>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            {getFieldDecorator('categoryName', { initialValue: name })(
              <Search placeholder="Search Category Name" size="large" onSearch={handleSubmit} />
            )}
          </Col>
          <Col {...ColProps} xl={{ span: 8 }} md={{ span: 10 }} sm={{ span: 14 }}>
            <FilterItem label="CreatedAt">
              {getFieldDecorator('createdAt', { initialValue: initialCreateTime })(
                <RangePicker style={{ width: '100%' }} size="large" onChange={handleChange.bind(null, 'createdAt')} />
              )}
            </FilterItem>
          </Col>
          <Col {...ColProps} xl={{ span: 16 }} md={{ span: 18 }} sm={{ span: 22 }}>
            {getFieldDecorator('customSearch', { initialValue: customSearch })(
              <Input placeholder="Custom search query url" type="textarea" rows={2} />
            )}
          </Col>

          <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div >
                <Button type="primary" size="small" className="margin-right" onClick={handleSubmit}>Go</Button>
                <Button size="small" className="margin-right" onClick={handleReset}>Reset</Button>
                <Button size="small" onClick={handleClose}>Close</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  visiblePanel: PropTypes.bool,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
