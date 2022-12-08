/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, DatePicker, Select, Row, Col, Icon, Form } from 'antd'
import moment from 'moment'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { Option } = Select
const FormItem = Form.Item
const { RangePicker } = DatePicker

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

const Filter = ({ listAllStores, loading, onDateChange, from, to, form: { getFieldsValue, validateFields, getFieldDecorator }, user, listRekap, storeInfo }) => {
  const printProps = {
    user, listRekap, storeInfo, from, to
  }

  const handleSearch = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      if (data.rangePicker) {
        const from = data.rangePicker[0].format('YYYY-MM-DD')
        const to = data.rangePicker[1].format('YYYY-MM-DD')
        onDateChange(from, to, data.storeId)
      }
    })
  }

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []

  return (
    <Row>
      <Col {...leftColumn} >
        <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
          {getFieldDecorator('rangePicker', {
            initialValue: from && to ? [moment.utc(from, 'YYYY-MM-DD'), moment.utc(to, 'YYYY-MM-DD')] : null
          })(
            <RangePicker size="large" format="DD-MMM-YYYY" />
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
              {childrenTransNo}
            </Select>
          )}
        </FormItem>
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          style={{ marginLeft: '5px' }}
          disabled={loading.effects['generalLedger/queryTrialBalance']}
          className="button-width02 button-extra-large"
          onClick={() => handleSearch()}
        >
          <Icon type="search" className="icon-large" />
        </Button>
        {printProps.listRekap && printProps.listRekap.length > 0 && (<PrintPDF {...printProps} />)}
        {printProps.listRekap && printProps.listRekap.length > 0 && (<PrintXLS {...printProps} />)}
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
