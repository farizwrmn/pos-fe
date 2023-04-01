import { Col, Row } from 'antd'
import CsvList from './CsvList'
import PaymentList from './PaymentList'

const listColumnProps = {
  xl: 12,
  lg: 12,
  md: 12,
  sm: 24,
  xs: 24
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
      <Col {...listColumnProps}>
        <CsvList {...csvListProps} />
      </Col>
    </Row>
  )
}

export default ConflictedList
