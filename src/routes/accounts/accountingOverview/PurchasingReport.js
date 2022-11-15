import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import ReportItem from './components/ReportItem'
import {
  PURCHASE_SUMMARY,
  VENDOR_BALANCE,
  PURCHASE_SUPPLIER,
  AGED_PAYABLE,
  PURCHASE_PRODUCT
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
  const purchaseSummaryReportProps = {
    content: 'Menampilkan daftar kronologis untuk semua pembelian dan pembayaran Anda untuk rentang tanggal yang dipilih.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: PURCHASE_SUMMARY
        }
      })
    }
  }

  const vendorBalanceReportProps = {
    content: 'Menampilkan jumlah nilai yang Anda hutang pada setiap Supplier.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: VENDOR_BALANCE
        }
      })
    }
  }

  const purchaseSupplierReportProps = {
    content: 'Menampilkan setiap pembelian dan jumlah untuk setiap Supplier.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: PURCHASE_SUPPLIER
        }
      })
    }
  }

  const agedPayableReportProps = {
    content: 'Laporan ini memberikan ringkasan hutang Anda, menunjukkan setiap vendor Anda secara bulanan, serta jumlah total dari waktu ke waktu. Hal ini praktis untuk membantu melacak hutang Anda.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: AGED_PAYABLE
        }
      })
    }
  }

  const purchaseProductReportProps = {
    content: 'Menampilkan daftar kuantitas pembelian per produk, termasuk jumlah retur, net pembelian, dan harga pembelian rata-rata.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: PURCHASE_PRODUCT
        }
      })
    }
  }

  return (
    <Row>
      <Col {...column}>
        <ReportItem title="Purchase Summary" {...purchaseSummaryReportProps} />
        <ReportItem title="Vendor Balance" {...vendorBalanceReportProps} />
      </Col>
      <Col {...column}>
        <ReportItem title="Purchase By Supplier" {...purchaseSupplierReportProps} />
        <ReportItem title="Aged Payable" {...agedPayableReportProps} />
        <ReportItem title="Purchase by Product" {...purchaseProductReportProps} />
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
