/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Select, DatePicker, Row, Col, Icon, Form, message } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker
const { Option } = Select
const FormItem = Form.Item

const leftColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12
}

const Filter = ({ onDateChange, listSupplier, listAllStores, loading, onListReset, form: { getFieldsValue, getFieldValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {
  // const handleChange = (value) => {
  //   const from = moment(value, 'YYYY-MM').startOf('month').format('YYYY-MM-DD')
  //   const to = moment(value, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
  //   onDateChange(from, to)
  // }
  const handleSearch = () => {
    const storeId = getFieldValue('storeId')
    const dateString = getFieldValue('rangePicker')
    if (!dateString) {
      message.warning('Require Date')
      return
    }
    const from = moment(dateString[0]).format('YYYY-MM-DD')
    const to = moment(dateString[1]).format('YYYY-MM-DD')
    onDateChange(from, to, storeId)
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

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  const supplierData = (listSupplier || []).length > 0 ?
    ([<Option value="all" key="all">Select All</Option>]).concat(listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>))
    : []

  const normalizeAll = (value, prevValue = []) => {
    let selectedValue = ''
    let selectedPrevValue = ''
    for (let key in value) {
      if (value[key].key === 'all') {
        selectedValue = 'all'
      }
    }
    for (let key in prevValue) {
      if (prevValue[key].key === 'all') {
        selectedPrevValue = 'all'
      }
    }
    if (selectedValue === 'all' && value.length > 0) {
      return ([{ key: 'all', label: 'Select All' }])
    }
    if (selectedValue === 'all' && selectedPrevValue !== 'all') {
      // return (['all']).concat(listSupplier.map(item => item.id))
      return ([{ key: 'all', label: 'Select All' }])
    }
    if (selectedValue !== 'all' && selectedPrevValue === 'all') {
      return []
    }
    return value
  }

  return (
    <Row >
      <Col {...leftColumn} >
        <Form>
          <FormItem label="Trans Date">
            {getFieldDecorator('rangePicker')(
              <RangePicker size="large" style={{ width: '189px' }} placeholder="Select Period" />
            )}
          </FormItem>
          <FormItem
            label="Store"
          >
            {getFieldDecorator('storeId')(
              <Select
                mode="multiple"
                allowClear
                size="large"
                style={{ width: '189px' }}
                placeholder="Choose StoreId"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {childrenTransNo}
              </Select>
            )}
          </FormItem>
          <FormItem label="Supplier">
            {getFieldDecorator('supplierCode', {
              rules: [
                {
                  required: true
                }
              ],
              normalize: normalizeAll
            })(<Select
              showSearch
              optionFilterProp="children"
              labelInValue
              multiple
              allowClear
              maxTagCount={5}
              // onChange={handleChange}
              style={{ width: '100%' }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >
              {supplierData}
            </Select>)}
          </FormItem>
        </Form>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          disabled={loading.effects['accountsReport/queryPayableTrans']}
          style={{ marginLeft: '5px' }}
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
        {<PrintPDF {...printProps} />}
        {<PrintXLS {...printProps} />}
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
