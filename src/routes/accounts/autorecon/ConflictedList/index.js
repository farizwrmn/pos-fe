import { Col, Row } from 'antd'
import CsvList from './CsvList'
import PaymentList from './PaymentList'

const listColumnProps = {
  xl: 11,
  lg: 11,
  md: 11,
  sm: 24,
  xs: 24
}

const gapColumnProps = {
  xl: 2,
  lg: 2,
  md: 2,
  sm: 0,
  xs: 0
}

const ConflictedList = ({
  conflictedCSV,
  selectedCsvRowKeys,
  conflictedPayment,
  selectedPaymentRowKeys,
  dispatch
}) => {
  const csvListProps = {
    conflictedCSV,
    selectedCsvRowKeys,
    dispatch
  }

  const paymentListProps = {
    conflictedPayment,
    selectedPaymentRowKeys,
    dispatch
  }

  return (
    <Row>
      <Col {...listColumnProps}>
        <PaymentList {...paymentListProps} />
      </Col>
      <Col {...gapColumnProps} />
      <Col {...listColumnProps}>
        <CsvList {...csvListProps} />
      </Col>
    </Row>
  )
}

export default ConflictedList
