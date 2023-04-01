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
  conflictedPayment
}) => {
  const csvListProps = {
    conflictedCSV
  }

  const paymentListProps = {
    conflictedPayment

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
