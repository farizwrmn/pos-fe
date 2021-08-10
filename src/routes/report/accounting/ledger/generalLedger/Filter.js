/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Select, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker
const { Option } = Select

const leftColumn = {
  xs: 24,
  sm: 14,
  md: 14,
  lg: 14,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 10,
  md: 10,
  lg: 10
}

const Filter = ({
  onOk,
  onChangePeriod,
  dispatch,
  listAccountCode = [],
  onListReset,
  onShowCategories,
  onShowBrands,
  form: {
    resetFields,
    getFieldDecorator,
    getFieldsValue,
    validateFields
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
        ...getFieldsValue()
      }
      if (data.supplierCode) {
        data.accountId = data.accountCode.key
      }
      if (data.rangePicker) {
        onChangePeriod(data)
      }
    })
  }

  // const onChange = (date, dateString) => {
  //   if (date) {
  //     let period = dateString ? moment(dateString).format('M') : null
  //     let year = dateString ? moment(dateString).format('Y') : null
  //     onChangePeriod(period, year)
  //   } else {
  //     const { pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         activeKey
  //       }
  //     }))
  //     onListReset()
  //   }
  //   resetFields()
  // }

  const params = location.search.substring(1)
  let query = params ? JSON.parse(`{"${decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`) : {}

  if (!query.year && !query.period) {
    resetFields(['rangePicker'])
  }

  const printProps = {
    activeKey,
    ...otherProps
  }

  let childrenTransNo = listAccountCode.length > 0 ? listAccountCode.map(x => (<Option value={x.id} key={x.id} title={`${x.accountName} (${x.accountCode})`}>{`${x.accountName} (${x.accountCode})`}</Option>)) : []
  const { from, to } = query
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Period">
          {getFieldDecorator('rangePicker', {
            initialValue: from && to ? [moment.utc(from, 'YYYY-MM-DD'), moment.utc(to, 'YYYY-MM-DD')] : [moment().startOf('month'), moment().endOf('month')],
            rules: [
              {
                required: true
              }
            ]
          })(
            <RangePicker allowClear={false} size="large" format="DD-MMM-YYYY" />
          )}
        </FilterItem>
        <FilterItem
          label="Account Code"
        >
          {getFieldDecorator('accountCode')(
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose Account Code"
              showSearch
              optionFilterProp="children"
              labelInValue
              filterOption={filterOption}
            >
              {childrenTransNo}
            </Select>
          )}
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
