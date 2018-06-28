/**
 * Created by Veirry on 23/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, DatePicker, Row, Col, Icon, Form, Select, Modal } from 'antd'
import { FilterItem } from 'components'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const Option = Select.Option
const { MonthPicker } = DatePicker

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
  period,
  year,
  onChangePeriod,
  // productCode,
  // productName,
  listProduct,
  dispatch,
  onListReset,
  form: {
    getFieldsValue,
    resetFields,
    getFieldDecorator,
    validateFields
  },
  ...printProps }) => {
  let optionSelect = []
  let optionSelectName = []
  const selectChildren = () => {
    for (let i = 0; i < listProduct.length; i += 1) {
      optionSelect.push(<Option key={listProduct[i].productCode.toString(36)}>{listProduct[i].productCode.toString(36)}</Option>)
    }
  }
  const selectChildrenName = () => {
    for (let i = 0; i < listProduct.length; i += 1) {
      optionSelectName.push(<Option key={listProduct[i].productName.toString(36)}>{listProduct[i].productName.toString(36)}</Option>)
    }
  }
  const exportProps = {
    period,
    year,
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
      if (data.productCode === undefined) {
        data.productCode = []
      }
      if (data.productName === undefined) {
        data.productName = []
      }
      if (data.productCode.length === 0 && data.productName.length === 0) {
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
      let period = moment(data.Period).format('M')
      let year = moment(data.Period).format('Y')
      onOk(period, year, data)
    })
  }
  const resetSelected = (e) => {
    resetFields([e])
  }
  const onChange = (date, dateString) => {
    let period = moment(dateString).format('M')
    let year = moment(dateString).format('Y')
    onChangePeriod(period, year)
    resetFields()
  }
  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Period">
          {getFieldDecorator('Period', {
            initialValue: moment.utc(`${period}-${year}`, 'MM-YYYY'),
            rules: [
              {
                required: true
              }
            ]
          })(<MonthPicker style={{ width: '189px' }} onChange={onChange} placeholder="Select Period" />)}
        </FilterItem>
        {/* <FilterItem label="Category">
            {getFieldDecorator('category')(<Select
              showSearch
              placeholder="Select category"
              style={{ width: '189px', marginTop: '5px' }}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>)}
          </FilterItem> */}
        <Row style={{ marginTop: 5 }}>
          <Col lg={12} md={24} >
            <FilterItem label="Product Code">
              {getFieldDecorator('productCode', {
              })(<Select
                className=""
                mode="multiple"
                style={{ width: '189px' }}
                placeholder="Select Code"
                onFocus={selectChildren()}
                onChange={() => resetSelected('productName')}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                {...printProps}
              >
                {optionSelect}
              </Select>)}
            </FilterItem>
          </Col>
          <Col lg={12} md={24} >
            <FilterItem label="Product Name">
              {getFieldDecorator('productName', {
              })(<Select
                mode="multiple"
                style={{ width: '189px' }}
                placeholder="Select Name"
                onFocus={selectChildrenName()}
                onChange={() => resetSelected('productCode')}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                {...printProps}
              >
                {optionSelectName}
              </Select>
              )}
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
  productCode: PropTypes.array,
  period: PropTypes.string,
  year: PropTypes.string
}

export default Form.create()(Filter)
