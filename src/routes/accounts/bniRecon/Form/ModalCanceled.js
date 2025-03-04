import { Button, Card, Col, Modal, Row } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const ModalCanceled = ({
  loading,
  list,
  onCancel,
  ackPayment,
  ...modalProps
}) => {
  const handleAcknowledge = ({ id }) => {
    Modal.confirm({
      title: 'Acknowledge this payment',
      content: 'Are you sure?',
      onOk: () => {
        ackPayment(id)
      }
    })
  }

  return (
    <Modal
      {...modalProps}
      footer={[
        <Button type="ghost" size="default" onClick={onCancel}>Close</Button>
      ]}
      onCancel={onCancel}
    >
      {list && list.length > 0 && list.map((record) => {
        return (
          <Card
            title={(
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  Payment
                </div>
                <Button
                  type="primary"
                  onClick={() => handleAcknowledge({ id: record.id })}
                  loading={loading.effects['autorecon/ackPayment']}
                  disabled={loading.effects['autorecon/queryCanceledPayment']}
                >
                  Acknowledge
                </Button>
              </div>
            )}
            style={{ marginBottom: '10px' }}
            loading={loading.effects['autorecon/queryCanceledPayment']}
          >
            <Row>
              <Col span={12}>Trans No</Col>
              <Col span={12}>{record.transNo}</Col>
            </Row>
            <Row>
              <Col span={12}>{moment(record.transDate).format('YYYY-MM-DD, HH:mm:ss')}</Col>
              <Col span={12}>{currencyFormatter(Number(record.amount))}</Col>
            </Row>
            <Row>
              <Col span={12}>Batch Number</Col>
              <Col span={12}>{record.batchNumber}</Col>
            </Row>
            <Row>
              <Col span={12}>Card Name</Col>
              <Col span={12}>{record.cardName}</Col>
            </Row>
            <Row>
              <Col span={12}>Type</Col>
              <Col span={12}>{record.typeCode}</Col>
            </Row>
          </Card>
        )
      })}
    </Modal>
  )
}

export default ModalCanceled
