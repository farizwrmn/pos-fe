/**
 * Created by Veirry on 23/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, DatePicker, Row, Col, Icon, Form, Select, Modal, Spin } from 'antd'
import { FilterItem } from 'components'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const Option = Select.Option
const { RangePicker } = DatePicker

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
  from,
  to,
  loading,
  onChangePeriod,
  list,
  onListReset,
  showLov,
  optionSelect = (list || []).length > 0 ? list.map(c => <Option value={c.id} key={c.id} title={`${c.productName} (${c.productCode})`}>{`${c.productName} (${c.productCode})`}</Option>) : [],
  form: {
    getFieldsValue,
    resetFields,
    getFieldDecorator,
    validateFields
  },
  ...printProps }) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const exportProps = {
    from,
    to,
    ...printProps
  }

  const handleReset = () => {
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
      if (data.productId === undefined) {
        data.productId = []
      }
      if (data.productId.length === 0) {
        Modal.confirm({
          title: 'Cannot find parameter',
          content: 'Try to reset the form',
          onOk () {
            handleReset()
          },
          onCancel () {

          }
        })
        return
      }
      onOk({
        ...data,
        productId: data.productId && data.productId.length > 0 ?
          data.productId.map(item => item.key) : []
      })
    })
  }
  const onChange = (value) => {
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onChangePeriod(from, to)
    resetFields()
  }
  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Period">
          {getFieldDecorator('Period', {
            initialValue: from && to ? [moment.utc(from, 'YYYY-MM-DD'), moment.utc(to, 'YYYY-MM-DD')] : undefined,
            rules: [
              {
                required: true
              }
            ]
          })(
            <RangePicker size="large" onChange={value => onChange(value)} format="DD-MMM-YYYY" />
          )}
        </FilterItem>
        <Row style={{ marginTop: 5 }}>
          <Col lg={16} md={24} >
            <FilterItem label="Product">
              {getFieldDecorator('productId', {
              })(<Select
                mode="multiple"
                style={{ width: '250px' }}
                placeholder="Select Product"

                showSearch
                allowClear
                optionFilterProp="children"

                notFoundContent={loading.effects['productstock/query'] ? <Spin size="small" /> : null}
                onSearch={value => showLov('productstock', { q: value })}
                labelInValue
                filterOption={filterOption}
              >
                {optionSelect}
              </Select>)}
            </FilterItem>
          </Col>
        </Row>
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
        {<PrintPDF {...exportProps} />}
        {<PrintXLS {...exportProps} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  productId: PropTypes.array,
  period: PropTypes.string,
  year: PropTypes.string
}

export default Form.create()(Filter)
