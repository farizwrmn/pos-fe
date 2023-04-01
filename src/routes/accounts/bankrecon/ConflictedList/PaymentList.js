import { Card, Col, Row } from 'antd'
import { getName } from 'utils/link'
import { currencyFormatter } from 'utils/string'

const PaymentList = ({
  conflictedPayment
}) => {
  console.log('conflictedPayment', conflictedPayment[0])
  return (
    <div>
      {conflictedPayment && conflictedPayment[0] && (
        <div
          style={{
            padding: '10px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          TIDAK ADA DI CSV
        </div>
      )}
      <Row style={{ zIndex: 1 }}>
        <Col md={24} lg={16}>
          {conflictedPayment && conflictedPayment.map((item) => {
            return (
              <div>
                <Card
                  title={(
                    <div>
                      {getName(item.transactionType)}
                    </div>
                  )}
                  style={{ marginBottom: '1em' }}
                >
                  <Row>
                    <Col span={12}>
                      <div>Trans No:</div>
                    </Col>
                    <Col span={12}>
                      {item.transNo}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>{`${item.transDate}, ${item.transTime}`}</div>
                    </Col>
                    <Col span={12}>
                      {item.debit && item.debit != null ? <div>{`(DB) ${currencyFormatter(Number(item.debit))}`}</div> : null}
                      {item.credit && item.credit != null ? <div>{`(CR) ${currencyFormatter(Number(item.credit))}`}</div> : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>Description:</div>
                    </Col>
                    <Col span={12}>
                      {item.description}
                    </Col>
                  </Row>
                </Card>
              </div>
            )
          })}
        </Col>
        <Col md={24} lg={12} />
      </Row>
    </div>
  )
}

export default PaymentList
