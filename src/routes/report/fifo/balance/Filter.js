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

const Filter = ({
  onOk,
  onChangePeriod,
  productCode,
  productName,
  dispatch,
  onListReset,
  form: {
    validateFields,
    getFieldsValue,
    resetFields,
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
      let period = moment(data.Period).format('M')
      let year = moment(data.Period).format('Y')
      onOk(period, year, data)
    })
  }

  let optionSelectCode = []
  let optionSelectName = []
  const selectChildren = () => {
    for (let i = 0; i < productCode.length; i += 1) {
      optionSelectCode.push(<Option key={productCode[i].toString(36)}>{productCode[i].toString(36)}</Option>)
    }
  }
  const selectChildrenName = () => {
    for (let i = 0; i < productCode.length; i += 1) {
      optionSelectName.push(<Option key={productName[i].toString(36)}>{productName[i].toString(36)}</Option>)
    }
  }

  const resetSelected = (e) => {
    resetFields([e])
  }

  return (
    <Row>
      <Col lg={14} md={24}>
        <FilterItem label="Period">
          {getFieldDecorator('rangePicker', {
            initialValue: query.year && query.period ? moment(`${query.year}-${query.period}`, 'YYYY-MM') : '',
            rules: [
              {
                required: true
              }
            ]
          })(
            <MonthPicker onChange={onChange} placeholder="Select Period" />
          )}
        </FilterItem>
        {activeKey === '3' &&
          <div>
            {/* <FilterItem label="Category">
              {getFieldDecorator('category')(<Select
                showSearch
                placeholder="Select category"
                style={{ width: '189px', margin: '5px 0' }}
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
                    mode="multiple"
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
                <FilterItem label="Product Name">
                  {getFieldDecorator('productName', {
                  })(<Select
                    mode="multiple"
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
          </div>
        }
      </Col>
      <Col lg={10} md={24} style={{ margin: '10px 0', float: 'right', textAlign: 'right' }}>
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
