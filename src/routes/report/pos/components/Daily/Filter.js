/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { ModalFilter } from 'components'
import { Button, Select, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
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

const Filter = ({
  showFilter,
  listDaily,
  listDailyTempCategories,
  listDailyTempBrands,
  selectCategory,
  selectBrand,
  onListReset,
  modalProps,
  ...printProps,
  form: {
    getFieldDecorator,
    resetFields
  } }) => {
  const { modalFilterPOSByDaily, onDateChange } = modalProps
  const { brand, category } = printProps
  let optionCategory = []
  let optionBrand = []
  if (listDailyTempCategories && listDailyTempCategories.length) {
    let myArray = listDailyTempCategories
    let categories = _.groupBy(myArray, 'categoryName')
    for (let i = 0; i < Object.keys(categories).length; i += 1) {
      optionCategory.push(<Option key={Object.keys(categories)[i].toString(36)}>{Object.keys(categories)[i].toString(36)}</Option>)
    }
  }
  if (listDailyTempBrands && listDailyTempBrands.length) {
    let brands = _.groupBy(listDailyTempBrands, 'brandName')
    for (let i = 0; i < Object.keys(brands).length; i += 1) {
      optionBrand.push(<Option key={Object.keys(brands)[i].toString(36)}>{Object.keys(brands)[i].toString(36)}</Option>)
    }
  }

  const handleReset = () => {
    onListReset()
  }

  const printOpts = {
    listDaily,
    ...printProps
  }

  const changeCategory = (value) => {
    resetFields(['brand'])
    selectCategory(value)
  }

  const changeBrand = (value) => {
    selectBrand(value)
  }

  const modalOpts = {
    ...modalProps,
    onDateChange,
    fields: (
      <Form layout="vertical">
        <FormItem label="Category" {...formItemLayout}>
          {getFieldDecorator('category', {
            initialValue: category !== 'ALL CATEGORY' ? category : null
          })(
            <Select
              mode="default"
              allowClear
              onChange={value => changeCategory(value)}
            >
              {optionCategory}
            </Select>
          )}
        </FormItem>
        <FormItem label="Brand" {...formItemLayout}>
          {getFieldDecorator('brand', {
            initialValue: brand !== 'ALL BRAND' ? brand : null
          })(
            <Select
              mode="default"
              allowClear
              onChange={value => changeBrand(value)}
            >
              {optionBrand}
            </Select>
          )}
        </FormItem>
      </Form>
    )
  }

  return (
    <Row>
      {modalFilterPOSByDaily && <ModalFilter {...modalOpts} />}
      <Col {...leftColumn} />
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large"
          onClick={() => showFilter()}
        >
          <Icon type="filter" className="icon-large" />
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
  onListReset: PropTypes.func.isRequired,
  showFilter: PropTypes.func,
  listDaily: PropTypes.array
}

export default Form.create()(Filter)
