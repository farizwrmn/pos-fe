/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Select, Row, Col, Icon, Form, Tooltip } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const FormItem = Form.Item
const { MonthPicker } = DatePicker
const { RangePicker } = DatePicker
const Option = Select.Option

const Filter = ({ onDateChange, onFilterChange, listPOSCompareSvsI, onListReset,
                  listCategory,
                  showCategories,
                  listBrand,
                  showBrands,
                  form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator },
                  ...printProps }) => {
  const handleChange = () => {
    const data = getFieldsValue()
    let param={}
    if (data) {
      const toDay = new Date()
      const firstDay = new Date(toDay.getFullYear(), toDay.getMonth(), 1)
      if (!data.period) data.period = moment(toDay, 'YYYY/MM/DD')

      param.period = data.period.format('MM')
      param.year = data.period.format('YYYY')

      param.from = data.rangePicker ? data.rangePicker[0].format('YYYY-MM-DD') : moment(firstDay, 'L').format('YYYY-MM-DD')
      param.to = data.rangePicker ? data.rangePicker[1].format('YYYY-MM-DD') :moment(toDay, 'L').format('YYYY-MM-DD')
      param.category = data.category.key
      // param.brand = data.brand
    }

    onFilterChange(param)
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

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 8
      },
      sm: {
        span: 8
      },
      md: {
        span: 8
      }
    },
    wrapperCol: {
      xs: {
        span: 16
      },
      sm: {
        span: 14
      },
      md: {
        span: 14
      }
    }
  }

  const brand = () => {
    showBrands()
  }

  const category = () => {
    showCategories()
  }

  const productCategory = listCategory.length > 0 ? listCategory.map(c => <Option value={c.id} key={c.id}>{c.categoryName}</Option>) : []
  const productBrand = listBrand.length > 0 ? listBrand.map(b => <Option value={b.id} key={b.id}>{b.brandName}</Option>) : []

  const printOpts = {
    listPOSCompareSvsI,
    ...printProps
  }
  const toDay = new Date()
  const firstDay = new Date(toDay.getFullYear(), toDay.getMonth(), 1)
  return (
    <div>
      <Row>
        <Col lg={10} md={24}>
          <FormItem label="Sales Range Date" {...formItemLayout}>
            {getFieldDecorator('rangePicker')(
              <RangePicker size="large"
                // defaultValue={[moment(firstDay, 'YYYY/MM/DD'), moment(toDay, 'YYYY/MM/DD')]}
                onChange={value => handleChangeDate(value)}
                format="DD-MMM-YYYY"
              />
            )}
          </FormItem>
          <FormItem label="Inventory Period" {...formItemLayout}>
            {getFieldDecorator('period', {
              rules: [
                {
                  required: true
                }
              ]
            })(<MonthPicker
              // defaultValue={moment(toDay, 'YYYY/MM/DD')}
              style={{ width: 195 }} />)}
          </FormItem>
          <FormItem label="Category" {...formItemLayout}>
            {getFieldDecorator('category',
              { initialValue: {key:"9", label: "TYRE"} }
            )(
              <Select
                mode="default"
                allowClear
                disabled
                labelInValue
                onFocus={() => category()}
                onBlur={() => handleChange()}
                style={{ width: '100%', height: '32px', marginTop: '5px' }}
              >
                {productCategory}
              </Select>
            )}
          </FormItem>
          <FormItem label="Brand" {...formItemLayout}>
            {getFieldDecorator('brand')(
              <Select
                mode="default"
                allowClear
                disabled
                onFocus={() => brand()}
                style={{ width: '100%', height: '32px' }}
              >
                {productBrand}
              </Select>
            )}
          </FormItem>
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
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
