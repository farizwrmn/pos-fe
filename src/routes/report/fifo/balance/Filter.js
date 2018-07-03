/**
 * Created by Veirry on 10/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form, Modal, Select } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { MonthPicker } = DatePicker
const Option = Select.Option

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
  // productCode,
  // productName,
  listProduct,
  listCategory,
  listBrand,
  dispatch,
  onListReset,
  onShowCategories,
  onShowBrands,
  form: {
    validateFields,
    getFieldsValue,
    resetFields,
    setFieldsValue,
    getFieldDecorator
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

  const onChange = (date, dateString) => {
    if (date) {
      let period = dateString ? moment(dateString).format('M') : null
      let year = dateString ? moment(dateString).format('Y') : null
      onChangePeriod(period, year)
    } else {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey
        }
      }))
      onListReset()
    }
    resetFields()
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
      let period = moment(data.rangePicker).format('M')
      let year = moment(data.rangePicker).format('Y')
      onOk(period, year, data)
    })
  }

  let optionSelectCode = []
  let optionSelectName = []
  const selectChildren = () => {
    for (let i = 0; i < listProduct.length; i += 1) {
      optionSelectCode.push(<Option key={listProduct[i].productCode.toString(36)}>{listProduct[i].productCode.toString(36)}</Option>)
    }
  }
  const selectChildrenName = () => {
    for (let i = 0; i < listProduct.length; i += 1) {
      optionSelectName.push(<Option key={listProduct[i].productName.toString(36)}>{listProduct[i].productName.toString(36)}</Option>)
    }
  }

  const resetSelected = (e) => {
    resetFields([e])
  }

  let categories = []
  if (listCategory.length) {
    categories.push(listCategory.map(x => (<Option key={x.id}>{x.categoryName}</Option>)))
  }

  let brands = []
  if (listBrand.length) {
    brands.push(listBrand.map(x => (<Option key={x.id}>{x.brandName}</Option>)))
  }

  const onSelectCategory = (value) => {
    let selected = listProduct.filter(x => x.categoryId === parseInt(value, 10)).map(x => x.productCode)
    setFieldsValue({
      productCode: selected
    })
    resetFields(['brand', 'productName'])
  }

  const onSelectBrand = (value) => {
    let selected = listProduct.filter(x => x.brandId === parseInt(value, 10)).map(x => x.productCode)
    setFieldsValue({
      productCode: selected
    })
    resetFields(['category', 'productName'])
  }

  return (
    <Row>
      <Col {...leftColumn} >
        <FilterItem label="Period">
          {getFieldDecorator('rangePicker', {
            initialValue: query.year && query.period ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : ''
          })(
            <MonthPicker onChange={onChange} placeholder="Select Period" />
          )}
        </FilterItem>
        {activeKey === '3' &&
          <Row>
            <Col lg={12} md={24} >
              <FilterItem label="Category">
                {getFieldDecorator('category')(<Select
                  showSearch
                  onFocus={onShowCategories}
                  onSelect={onSelectCategory}
                  placeholder="Select category"
                  style={{ width: '189px', margin: '5px 0' }}
                >
                  {categories}
                </Select>)}
              </FilterItem>
              <FilterItem label="Product Code">
                {getFieldDecorator('productCode')(<Select
                  mode="multiple"
                  allowClear
                  style={{ width: '189px' }}
                  placeholder="Select Code"
                  onFocus={selectChildren()}
                  onChange={() => resetSelected('productName')}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {optionSelectCode}
                </Select>)}
              </FilterItem>
            </Col>
            <Col lg={12} md={24} >
              <FilterItem label="Brand">
                {getFieldDecorator('brand')(<Select
                  showSearch
                  onFocus={onShowBrands}
                  onSelect={onSelectBrand}
                  placeholder="Select Brand"
                  style={{ width: '189px', margin: '5px 0' }}
                >
                  {brands}
                </Select>)}
              </FilterItem>
              <FilterItem label="Product Name">
                {getFieldDecorator('productName', {
                })(<Select
                  mode="multiple"
                  allowClear
                  style={{ width: '189px' }}
                  placeholder="Select Name"
                  onFocus={selectChildrenName()}
                  onChange={() => resetSelected('productCode')}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {optionSelectName}
                </Select>)}
              </FilterItem>
            </Col>
          </Row>
        }
      </Col>
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        {activeKey === '3' && <Button
          type="dashed"
          size="large"
          style={{ marginLeft: '5px' }}
          className="button-width02 button-extra-large"
          onClick={() => handleSearch()}
        >
          <Icon type="search" className="icon-large" />
        </Button>}
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
