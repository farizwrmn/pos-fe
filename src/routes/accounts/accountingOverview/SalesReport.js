import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import ReportItem from './components/ReportItem'
import {
  SALES_SUMMARY,
  SALES_PRODUCT
} from './constant'

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  dispatch
}) => {
  const salesSummaryReportProps = {
    content: 'Menunjukkan daftar kronologis dari semua faktur dan pembayaran untuk rentang tanggal yang dipilih.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: SALES_SUMMARY
        }
      })
    }
  }

  const salesProductReportProps = {
    content: 'Menampilkan daftar kuantitas penjualan per produk, termasuk jumlah retur, net penjualan, dan harga penjualan rata-rata.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: SALES_PRODUCT
        }
      })
    }
  }

  return (
    <Row>
      <Col {...column}>
        <ReportItem title="Sales Summary" {...salesSummaryReportProps} />
      </Col>
      <Col {...column}>
        <ReportItem title="Sales by Product" {...salesProductReportProps} />
      </Col>
    </Row>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default FormCounter
