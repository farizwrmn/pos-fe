/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Select, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const FormItem = Form.Item
const { MonthPicker } = DatePicker
const { RangePicker } = DatePicker
const Option = Select.Option

const leftColumn = {
  xs: 24,
  sm: 15,
  md: 15,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 9,
  md: 9,
  lg: 12
}

const formItemLayout = {
  labelCol: {
    xs: { span: 11 },
    sm: { span: 10 },
    md: { span: 9 }
  },
  wrapperCol: {
    xs: { span: 13 },
    sm: { span: 14 },
    md: { span: 15 }
  }
}

const Filter = ({ onDateChange, onSearch, listPOSCompareSvsI, onListReset,
  listCategory,
  countSelectedBrand,
  deselectedBrand,
  selectedBrand,
  showCategories,
  tableHeader,
  listBrand,
  showBrands,
  paramDate,
  diffDay,
  form: { getFieldsValue, setFieldsValue, resetFields, validateFields, getFieldDecorator },
  ...printProps }) => {
  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      let param = {}
      if (data) {
        const toDay = new Date()
        const firstDay = new Date(toDay.getFullYear(), toDay.getMonth(), 1)
        if (!data.period) data.period = moment(toDay, 'YYYY/MM/DD')

        param.period = data.period.format('MM')
        param.year = data.period.format('YYYY')

        param.from = data.rangePicker ? data.rangePicker[0].format('YYYY-MM-DD') : moment(firstDay, 'L').format('YYYY-MM-DD')
        param.to = data.rangePicker ? data.rangePicker[1].format('YYYY-MM-DD') : moment(toDay, 'L').format('YYYY-MM-DD')
        param.category = data.category
        param.brand = `[${selectedBrand.map(x => x.key).toString()}]`
      }

      onSearch(param)
    })
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

  const handleChangeDate = (value) => {
    handleReset()
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')

    onDateChange(from, to)
  }

  const brand = () => {
    showBrands()
  }

  const category = () => {
    showCategories()
  }

  const productCategory = listCategory.length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
  let productBrand = []
  if (listBrand.length > 0) {
    if (selectedBrand.length > 3) {
      productBrand = listBrand.map(b => <Option disabled={!selectedBrand.map(x => x.key).includes(b.brandCode)} value={b.brandCode} key={b.brandCode}>{b.brandName}</Option>)
    } else {
      productBrand = listBrand.map(b => <Option value={b.brandCode} key={b.brandCode}>{b.brandName}</Option>)
    }
  }

  const printOpts = {
    listPOSCompareSvsI,
    paramDate,
    diffDay,
    selectedBrand,
    tableHeader,
    ...printProps
  }

  const onSelectBrand = (value) => {
    countSelectedBrand(value)
  }

  const onDeselectBrand = (value) => {
    deselectedBrand(value)
  }

  return (
    <Row>
      <Col {...leftColumn}>
        <FormItem label="Sales Range Date" {...formItemLayout} >
          {getFieldDecorator('rangePicker', {
            rules: [{ required: true }]
          })(<RangePicker
            className="range-date"
            style={{ width: '70%' }}
            onChange={value => handleChangeDate(value)}
            format="DD-MMM-YYYY"
          />
          )}
          <span className="ant-form-text" style={{ paddingLeft: '4px' }}>{diffDay > 0 ? `${diffDay} day${diffDay === 1 ? '' : 's'}` : ''}</span>
        </FormItem>
        <FormItem label="Inventory Period" {...formItemLayout}>
          {getFieldDecorator('period', {
            rules: [{ required: true }]
          })(<MonthPicker style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="Category" {...formItemLayout}>
          {getFieldDecorator('category', {
            rules: [{ required: true }]
          })(
            <Select
              showSearch
              allowClear
              onFocus={() => category()}
              optionFilterProp="children"
              labelInValue
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              style={{ width: '100%', height: '32px', marginTop: '5px' }}
            >
              {productCategory}
            </Select>
          )}
        </FormItem>
        <FormItem label="Brand" {...formItemLayout}>
          {getFieldDecorator('brand')(
            <Select
              className="select-multiple-brand"
              mode="multiple"
              labelInValue
              onSelect={value => onSelectBrand(value)}
              onDeselect={value => onDeselectBrand(value)}
              onFocus={() => brand()}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              style={{ width: '100%' }}
            >
              {productBrand}
            </Select>
          )}
        </FormItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          size="large"
          style={{ marginLeft: '5px' }}
          type="primary"
          className="button-width02 button-extra-large"
          onClick={() => handleSearch()}
        >
          <Icon type="search" className="icon-large" />
        </Button>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          onClick={() => handleReset()}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
        {<PrintPDF {...printOpts} />}
        {<PrintXLS {...printOpts} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
