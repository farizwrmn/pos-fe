/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { Button, Select, DatePicker, Row, Col, Icon, Form } from 'antd'
import { FilterItem } from 'components'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker
const { Option } = Select

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

const Filter = ({ onChangePeriod, listSupplier = [], dispatch, onListReset, form: { resetFields, getFieldDecorator }, activeKey, ...otherProps }) => {
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

  const onChange = (date, dateString) => {
    if (date) {
      let period = dateString ? moment(dateString).format('M') : null
      let year = dateString ? moment(dateString).format('Y') : null
      onChangePeriod(period, year)
    }
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

  const supplierData = (listSupplier || []).length > 0 ? listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>) : []

  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Supplier">
          {getFieldDecorator('supplierCode', {
            rules: [
              {
                required: true
              }
            ]
          })(<Select
            showSearch
            optionFilterProp="children"
            labelInValue
            style={{ width: '100%' }}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
          >{supplierData}
          </Select>)}
        </FilterItem>
        <br />
        <FilterItem label="Period">
          {getFieldDecorator('rangePicker', { initialValue: query.year && query.period ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : '' })(
            <MonthPicker onChange={onChange} placeholder="Select Period" />
          )}
        </FilterItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
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
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
