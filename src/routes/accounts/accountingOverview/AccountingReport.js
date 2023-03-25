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
  const balanceSheetReportProps = {
    content: 'Menampilan apa yang anda miliki (aset), apa yang anda hutang (liabilitas), dan apa yang anda sudah investasikan pada perusahaan anda (ekuitas).',
    url: '/report/accounting/balance-sheet'
  }

  const profitLossReportProps = {
    content: 'Menampilkan setiap tipe transaksi dan jumlah total untuk pendapatan dan pengeluaran anda.',
    url: '/report/accounting/profit-loss'
  }

  const generalLedgerReportProps = {
    content: 'Daftar semua jurnal per transaksi yang terjadi dalam periode waktu. Hal ini berguna untuk melacak di mana transaksi Anda masuk ke masing-masing rekening.',
    url: '/report/accounting/consolidation/general-ledger'
  }

  const trialBalanceReportProps = {
    content: 'Menampilkan saldo dari setiap akun, termasuk saldo awal, pergerakan, dan saldo akhir dari periode yang ditentukan.',
    url: '/report/accounting/consolidation/trial-balance'
  }

  return (
    <Row>
      <Col {...column}>
        <ReportItem title="Balance Sheet" {...balanceSheetReportProps} />
        <ReportItem title="Profit/Loss" {...profitLossReportProps} />
      </Col>
      <Col {...column}>
        <ReportItem title="General Ledger" {...generalLedgerReportProps} />
        <ReportItem title="Trial Balance" {...trialBalanceReportProps} />
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
