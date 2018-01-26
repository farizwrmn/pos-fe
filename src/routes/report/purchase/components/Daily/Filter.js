/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Select, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker
const Option = Select.Option

const Filter = ({ onDateChange, onFilterChange, listDaily, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  let optionCategory = []
  let optionBrand = []
  if (listDaily.length > 0) {
    let myArray = listDaily
    let category = _.groupBy(myArray, 'categoryName')
    let brand = _.groupBy(myArray, 'brandName')
    for (let i = 0; i < Object.keys(category).length; i++) {
      optionCategory.push(<Option key={Object.keys(category)[i].toString(36)}>{Object.keys(category)[i].toString(36)}</Option>);
    }
    for (let i = 0; i < Object.keys(brand).length; i++) {
      optionBrand.push(<Option key={Object.keys(brand)[i].toString(36)}>{Object.keys(brand)[i].toString(36)}</Option>);
    }
  }

  const handleChange = (value) => {
    const data = getFieldsValue()
    data.mode = 'pbc'
    data.from = data.rangePicker[0].format('YYYY-MM-DD')
    data.to = data.rangePicker[1].format('YYYY-MM-DD')
    onFilterChange(data)
  }

  const handleChangeDate = (value) => {
    handleReset()
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to)
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
    resetFields()
    onListReset()
  }
  const printOpts = {
    listDaily,
    ...printProps
  }
  return (
    <div>
      <Row>
        <Col lg={10} md={24}>
          <FilterItem label="Trans Date">
            {getFieldDecorator('rangePicker')(
              <RangePicker size="large"
                onChange={(value) => handleChangeDate(value)}
                format="DD-MMM-YYYY" />
            )}
          </FilterItem>
          <FilterItem label="Category">
            {getFieldDecorator('category')(
              <Select
                mode="default"
                allowClear
                onBlur={() => handleChange()}
                style={{ width: '100%', height: '32px', marginTop: '5px' }}
              >
                {optionCategory}
              </Select>
            )}
          </FilterItem>
          <FilterItem label="Brand">
            {getFieldDecorator('brand')(
              <Select
                mode="combobox"
                allowClear
                style={{ width: '100%', height: '32px' }}
              >
                {optionBrand}
              </Select>
            )}
          </FilterItem>
        </Col>
        <Col lg={14} md={24} style={{ float: 'right', textAlign: 'right' }}>
          <Button
            size="large"
            style={{ marginLeft: '5px' }}
            type="primary"
            className="button-width02 button-extra-large"
            onClick={() => handleChange()}
          >
            <Icon type="search" className="icon-large" />
          </Button>
          <Button type="dashed" size="large"
            className="button-width02 button-extra-large bgcolor-lightgrey"
            onClick={() => handleReset()}
          >
            <Icon type="rollback" className="icon-large" />
          </Button>
          {<PrintPDF {...printOpts} />}
          {<PrintXLS {...printOpts} />}
        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
