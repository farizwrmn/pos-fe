import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import ReportItem from './components/ReportItem'

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = () => {
  const purchaseSummaryReportProps = {
    content: 'Menampilkan daftar kronologis untuk semua pembelian dan pembayaran Anda untuk rentang tanggal yang dipilih.',
    url: '/report/purchase/summary'
  }

  const vendorBalanceReportProps = {
    content: 'Menampilkan jumlah nilai yang Anda hutang pada setiap Supplier.',
    url: '/report/accounts/payable?activeKey=1'
  }

  const agedPayableReportProps = {
    content: 'Laporan ini memberikan ringkasan hutang Anda, menunjukkan setiap vendor Anda secara bulanan, serta jumlah total dari waktu ke waktu. Hal ini praktis untuk membantu melacak hutang Anda.',
    url: '/report/accounts/payable?activeKey=1'
  }

  const purchaseProductReportProps = {
    content: 'Menampilkan daftar kuantitas pembelian per produk, termasuk jumlah retur, net pembelian, dan harga pembelian rata-rata.',
    url: '/report/purchase/summary?activeKey=3'
  }

  return (
    <Row>
      <Col {...column}>
        <ReportItem title="Purchase Summary" {...purchaseSummaryReportProps} />
        <ReportItem title="Vendor Balance" {...vendorBalanceReportProps} />
      </Col>
      <Col {...column}>
        {/* <ReportItem title="Purchase By Supplier" {...purchaseSupplierReportProps} /> */}
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
