import { Button, Card, Col, Modal, Row } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const ConflictedList = ({
  conflictedCSV,
  loading,
  onSubmit
}) => {
  return (
    <div>
      {conflictedCSV && conflictedCSV[0] && (
        <div
          style={{
            padding: '10px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          TIDAK ADA DI AKUN INI
        </div>
      )}
      <Row style={{ zIndex: 1 }}>
        <Col md={24} lg={12}>
          {conflictedCSV && conflictedCSV.map((item) => {
            return (
              <div style={{ marginBottom: '10px' }}>
                <Card
                  title={(
                    <div>
                      {`( ${item.approvalCode} ) - ${item.merchantName}`}
                    </div>
                  )}
                  extra={
                    item.recon === 0 ? (
                      <Button
                        shape="circle"
                        type="primary"
                        loading={loading.effects['bankentry/reconImportData']}
                        disabled={loading.effects['bankentry/reconImportData']}
                        icon="check"
                        onClick={() => {
                          Modal.confirm({
                            title: 'Approve bank recon',
                            onOk () {
                              onSubmit(item)
                            }
                          })
                        }}
                      />
                    ) : null
                  }
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
                      <div>{`${moment(item.transDate, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}, ${item.transTime}`}</div>
                    </Col>
                    <Col span={12}>
                      {item.grossAmount && item.grossAmount != null ? <div>{`( ${item.recordSource} )( ${item.type} ) ${currencyFormatter(Number(item.grossAmount))}`}</div> : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>MDR Amount:</div>
                    </Col>
                    <Col span={12}>
                      {item.mdrAmount && item.mdrAmount != null ? <div>{`${currencyFormatter(Number(item.mdrAmount))}`}</div> : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>Redeem Amount:</div>
                    </Col>
                    <Col span={12}>
                      {item.redeemAmount && item.redeemAmount != null ? <div>{`${currencyFormatter(Number(item.redeemAmount))}`}</div> : currencyFormatter(0)}
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

export default ConflictedList
