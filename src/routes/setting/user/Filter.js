import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Row, Col, Input, Collapse } from 'antd'

const Search = Input.Search
const Panel = Collapse.Panel

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16
  }
}

const TwoColProps = {
  ...ColProps,
  xl: 96
}

const Filter = ({
  onFilterChange,
  onSearchHide,
  visiblePanel = false,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue
  }
}) => {
  const handleFields = (fields) => {
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

  const { name } = filter

  let initialCreateTime = []
  if (filter.createdAt && filter.createdAt[0]) {
    initialCreateTime[0] = moment(filter.createdAt[0])
  }
  if (filter.createdAt && filter.createdAt[1]) {
    initialCreateTime[1] = moment(filter.createdAt[1])
  }
  const collapseStyle = {
    show: { display: 'block' },
    hide: { display: 'none' }
  }

  return (
    <Collapse defaultActiveKey={['1']} style={visiblePanel ? collapseStyle.show : collapseStyle.hide}>
      <Panel header="Search" key="1">
        <Row gutter={24}>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            {getFieldDecorator('q', { initialValue: name })(
              <Search placeholder="Search User Name" size="large" onSearch={handleSubmit} />
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
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
