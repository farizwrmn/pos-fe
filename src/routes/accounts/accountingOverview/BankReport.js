import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import ReportItem from './components/ReportItem'
import {
  BANK_RECON_SUMMARY,
  BANK_STATEMENT
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
  const bankReconSummaryReportProps = {
    content: 'Menampilkan ringkasan rekonsiliasi bank yang sudah tercatat, dan juga perubahan saldo yang belum di catat atau identifikasi.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: BANK_RECON_SUMMARY
        }
      })
    }
  }

  const bankStatementReportProps = {
    content: 'Daftar seluruh transaksi rekening bank dalam suatu periode.',
    onClick () {
      dispatch({
        type: 'accountingOverview/updateState',
        payload: {
          modalParamVisible: true,
          modalType: BANK_STATEMENT
        }
      })
    }
  }

  return (
    <Row>
      <Col {...column}>
        <ReportItem title="Bank Reconciliation Summary" {...bankReconSummaryReportProps} />
      </Col>
      <Col {...column}>
        <ReportItem title="Bank Statement Reports" {...bankStatementReportProps} />
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
