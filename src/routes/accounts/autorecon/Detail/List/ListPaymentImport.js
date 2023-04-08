import { Card, Col, Row, Spin } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const ListPaymentImport = ({
  paymentImportData,
  loading
}) => {
  if (loading.effects['autorecon/queryDetail']) {
    return (
      <Card
        title="Import Payment"
      >
        <Spin size="Large" />
      </Card>
    )
  }

  return (
    <div>
      {paymentImportData && paymentImportData[0] && paymentImportData.map((record) => {
        return (
          <Card
            title="Import Payment"
            style={{ marginBottom: '10px' }}
          >
            <Col>
              <Row>
                <Col span={12}>
                  <div>EDC Batch Number:</div>
                </Col>
                <Col span={12}>
                  {record.edcBatchNumber}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div>{`${moment(record.transDate, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}, ${record.transTime}`}</div>
                </Col>
                <Col span={12}>
                  {record.grossAmount && record.grossAmount != null ? <div>{`( ${record.recordSource} )( ${record.type} ) ${currencyFormatter(Number(record.grossAmount))}`}</div> : null}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div>MDR Amount:</div>
                </Col>
                <Col span={12}>
                  {record.mdrAmount && record.mdrAmount != null ? <div>{`${currencyFormatter(Number(record.mdrAmount))}`}</div> : null}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div>Redeem Amount:</div>
                </Col>
                <Col span={12}>
                  {record.redeemAmount && record.redeemAmount != null ? <div>{`${currencyFormatter(Number(record.redeemAmount))}`}</div> : currencyFormatter(0)}
                </Col>
              </Row>
            </Col>
          </Card>
        )
      })}
    </div>
  )
}

export default ListPaymentImport
