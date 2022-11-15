import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import ReportItem from './components/ReportItem'
import {
  INVENTORY_SUMMARY,
  INVENTORY_VALUATION,
  INVENTORY_DETAILS
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
  const inventorySummaryReportProps = {
    content: 'Menampilkan daftar kuantitas dan nilai seluruh barang persediaan per tanggal yg ditentukan.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: INVENTORY_SUMMARY
        }
      })
    }
  }

  const inventoryValuationReportProps = {
    content: 'Rangkuman informasi penting seperti sisa stok yg tersedia, nilai, dan biaya rata-rata, untuk setiap barang persediaan.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: INVENTORY_VALUATION
        }
      })
    }
  }

  const inventoryDetailsReportProps = {
    content: 'Menampilkan daftar transaksi yg terkait dengan setiap Barang dan Jasa, dan menjelaskan bagaimana transaksi tersebut mempengaruhi jumlah stok barang, nilai, dan harga biaya nya.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: INVENTORY_DETAILS
        }
      })
    }
  }

  return (
    <Row>
      <Col {...column}>
        <ReportItem title="Inventory Summary" {...inventorySummaryReportProps} />
        <ReportItem title="Inventory Valuation" {...inventoryValuationReportProps} />
        <ReportItem title="Inventory Details" {...inventoryDetailsReportProps} />
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
