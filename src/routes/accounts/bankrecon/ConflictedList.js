import { Card, Col, Row } from 'antd'
import { currencyFormatter } from 'utils/string'

const ConflictedList = ({
  listConflictedBankRecon
}) => {
  return (
    <Row style={{ zIndex: 1 }}>
      <div>
        CONFLICTED LIST
      </div>
      <Col md={24} lg={12}>
        {listConflictedBankRecon && listConflictedBankRecon.map((item) => {
          return (
            <div>
              <Card
                title={(
                  <div>
                    {item.merchantName}
                  </div>
                )}
                style={{ marginBottom: '1em' }}
              >
                <Row>
                  <Col span={12}>
                    <div>EDC Batch Number:</div>
                  </Col>
                  <Col span={12}>
                    {item.edcBatchNumber}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div>Trans Date:</div>
                  </Col>
                  <Col span={12}>
                    <div>{item.transDate}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    Gross Amount:
                  </Col>
                  <Col span={12}>
                    {item.grossAmount ? <div>{`${currencyFormatter(Number(item.grossAmount))}`}</div> : null}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div>MDR Amount:</div>
                  </Col>
                  <Col span={12}>
                    {item.mdrAmount ? <div>{`${currencyFormatter(Number(item.mdrAmount))}`}</div> : null}
                  </Col>
                </Row>
              </Card>
            </div>
          )
        })}
      </Col>
      <Col md={24} lg={12} />
    </Row>
  )
}

export default ConflictedList
