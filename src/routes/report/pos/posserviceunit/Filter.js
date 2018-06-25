/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

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

const Filter = ({ onDateChange, dispatch, onListReset, listTrans, form: { resetFields, getFieldDecorator }, ...printProps }) => {
  const construct = (dataSales) => {
    let result = []
    let formatSales = []
    dataSales.reduce((res, value) => {
      if (!res[value.transDate]) {
        res[value.transDate] = {
          qtyUnit: 0,
          counter: 0,
          qtyProduct: 0,
          product: 0,
          qtyService: 0,
          service: 0,
          transDate: value.transDate
        }
        result.push(res[value.transDate])
      }
      // res[value.transDate].qtyUnit += (!(value.woReference === null || value.woReference === '') ? 1 : 0)
      // res[value.transDate].counter += (value.woReference === null || value.woReference === '' ? value.product : 0)
      res[value.transDate].qtyUnit += (value.qtyService !== 0 ? 1 : 0)
      res[value.transDate].counter += (value.qtyService === 0 ? value.product : 0)
      res[value.transDate].qtyProduct += value.qtyProduct
      // res[value.transDate].product += (!(value.woReference === null || value.woReference === '') ? value.product : 0)
      res[value.transDate].product += (value.qtyService !== 0 ? value.product : 0)
      res[value.transDate].qtyService += value.qtyService
      res[value.transDate].service += value.service
      return res
    }, {})
    for (let key = 0; key < result.length; key += 1) {
      const {
        transDate,
        product,
        qtyProduct,
        service,
        qtyService,
        qtyUnit,
        counter
      } = result[key]
      formatSales.push({
        transDate: moment(transDate).format('DD-MMM-YYYY'), // 'DD/MM/YY'
        title: moment(transDate).format('DD-MM-YYYY'), // 'DD/MM/YY'
        qtyUnit,
        counter,
        product,
        qtyProduct,
        service,
        qtyService
      })
    }
    return formatSales
  }

  const getListTrans = (listTrans) => {
    let tempListTrans = construct(listTrans)
    return tempListTrans
  }

  const handleChange = (value) => {
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to)
  }

  const handleReset = () => {
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname
    }))
    resetFields()
    onListReset()
  }

  const printOpts = {
    listTrans: getListTrans(listTrans),
    ...printProps
  }

  return (
    <Row style={{ clear: 'both' }}>
      <Col {...leftColumn} >
        <FilterItem label="Trans Date">
          {getFieldDecorator('rangePicker')(
            <RangePicker size="large" onChange={value => handleChange(value)} format="DD-MMM-YYYY" />
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
        {<PrintPDF {...printOpts} />}
        {<PrintXLS {...printOpts} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  onListReset: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired
}

export default Form.create()(Filter)
