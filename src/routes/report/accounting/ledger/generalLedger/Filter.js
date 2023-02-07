/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, DatePicker, Row, Select, Col, Icon, Form } from 'antd'
import PrintCSV from './PrintCSV'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

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
  listAllStores = [],
  onListReset,
  onShowCategories,
  onShowBrands,
  loading,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  },
  activeKey,
  ...otherProps
}) => {
  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (data.accountCode) {
        data.accountId = data.accountCode.map(item => item.key)
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

  const printProps = {
    activeKey,
    ...otherProps
  }

  let childrenTransNo = listAccountCode.length > 0 ? listAccountCode.map(x => (<Option value={x.id} key={x.id} title={`${x.accountName} (${x.accountCode})`}>{`${x.accountName} (${x.accountCode})`}</Option>)) : []
  let childrenStore = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []
  const { from, to } = query
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0

  return (
    <Row>
      <Col {...leftColumn} >
        <FormItem
          label="Period"
          hasFeedback
          {...formItemLayout}
        >
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
        </FormItem>
        <FormItem
          label="Account Code"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('accountCode')(
            <Select
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose Account Code"
              showSearch
              multiple
              optionFilterProp="children"
              labelInValue
              filterOption={filterOption}
            >
              {childrenTransNo}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="Store"
          help="clear it if available all stores"
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('storeId')(
            <Select
              mode="multiple"
              allowClear
              size="large"
              style={{ width: '100%' }}
              placeholder="Choose Store"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {childrenStore}
            </Select>
          )}
        </FormItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          style={{ marginLeft: '5px' }}
          disabled={loading.effects['generalLedger/queryGeneralLedger']}
          className="button-width02 button-extra-large"
          onClick={() => handleSearch()}
        >
          <Icon type="search" className="icon-large" />
        </Button>
        {printProps.listRekap && printProps.listRekap.length > 0 && (<PrintCSV {...printProps} />)}
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
