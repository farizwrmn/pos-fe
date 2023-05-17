import { Card, Col, Row } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const columnProps = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12
}

const ListPayment = ({
  paymentData,
  loading
}) => {
  if (loading.effects['autorecon/queryDetail'] || typeof paymentData === 'undefined') {
    return (
      <Card
        loading
        title="Payment"
      />
    )
  }

  return (
    <div>
      <Card
        title={(
          <a target="__blank" href={`/accounts/payment/${encodeURIComponent(paymentData.pos.transNo)}`}>
            Payment
          </a>
        )}
      >
        <Col>
          <Row>
            <Col {...columnProps}>
              EDC Batch Number
            </Col>
            <Col {...columnProps}>
              {paymentData.batchNumber || '-'}
            </Col>
          </Row>
          <Row>
            <Col {...columnProps}>
              Card Name
            </Col>
            <Col {...columnProps}>
              {paymentData.cardName}
            </Col>
          </Row>
          <Row>
            <Col {...columnProps}>
              Trans No
            </Col>
            <Col {...columnProps}>
              {paymentData.pos.transNo}
            </Col>
          </Row>
          <Row>
            <Col {...columnProps}>
              {moment(paymentData.transDate).format('DD MMM YYYY, HH:mm')}
            </Col>
            <Col {...columnProps}>
              {`( ${paymentData.typeCode} ) ${currencyFormatter(paymentData.amount)}`}
            </Col>
          </Row>
          <Row>
            <Col {...columnProps}>
              Charge
            </Col>
            <Col {...columnProps}>
              {currencyFormatter(paymentData.chargeTotal)}
            </Col>
          </Row>
        </Col>
      </Card>
    </div>
  )
}

export default ListPayment
