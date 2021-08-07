/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Button, Select, Row, DatePicker, Col, Icon, Form } from 'antd'
import { FilterItem } from 'components'
import moment from 'moment'
import PrintXLS from './PrintXLS'

const { Option } = Select
const { RangePicker } = DatePicker

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

const Filter = ({
  onChangePeriod,
  listSupplier = [],
  dispatch,
  onListReset,
  form: {
    resetFields,
    getFieldDecorator,
    validateFields,
    getFieldsValue
    // setFieldsValue
  },
  activeKey,
  ...otherProps
}) => {
  const handleReset = () => {
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey
      }
    }))
    resetFields()
    onListReset()
  }

  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        supplierId: []
      }
      console.log('data', data)
      if (data.supplierCode && data.supplierCode.length > 0) {
        for (let key in data.supplierCode) {
          const item = data.supplierCode[key]
          data.supplierId.push(item.key)
        }
        if (data && data.transDate && data.transDate.length > 0) {
          data.from = moment(data.transDate[0]).format('YYYY-MM-DD')
          data.to = moment(data.transDate[1]).format('YYYY-MM-DD')
        }
        onChangePeriod(data)
      }
    })
  }

  const params = location.search.substring(1)
  let query = params ? JSON.parse(`{"${decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) : {}

  if (!query.year && !query.period) {
    resetFields(['rangePicker'])
  }

  const printProps = {
    activeKey,
    ...otherProps
  }

  // const handleChange = (value) => {
  //   let selectedValue = ''
  //   if (value && value.length > 0) {
  //     for (let key in value) {
  //       if (value[key].key === 'all') {
  //         selectedValue = 'all'
  //       }
  //     }
  //   }

  //   console.log('value', value, selectedValue, selectedValue === 'all')

  //   if (selectedValue === 'all') {
  //     setFieldsValue({ supplierCode: null })
  //   }
  // }

  const normalizeAll = (value, prevValue = []) => {
    console.log('value', value)
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

  const supplierData = (listSupplier || []).length > 0 ?
    ([<Option value="all" key="all">Select All</Option>]).concat(listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>))
    : []
  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Supplier">
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
        </FilterItem>
        <FilterItem label="Date" >
          {getFieldDecorator('transDate', {
            initialValue: [moment().startOf('month'), moment().endOf('month')],
            rules: [{
              required: true
            }]
          })(<RangePicker allowClear={false} placeholder="Select Period" />)}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
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
        {<PrintXLS {...printProps} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
