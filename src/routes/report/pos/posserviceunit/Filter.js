/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Button, Row, Col, Icon } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

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

const Filter = ({ showFilter, onListReset, listTrans, ...printProps }) => {
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

  const handleReset = () => {
    onListReset()
  }

  const printOpts = {
    listTrans: getListTrans(listTrans),
    ...printProps
  }

  return (
    <Row >
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
  listTrans: PropTypes.array.isRequired
}

export default Filter
