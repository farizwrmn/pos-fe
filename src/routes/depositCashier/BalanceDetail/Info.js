import { Col, Row } from 'antd'
import moment from 'moment'

const BalanceInfo = ({
  balanceInfo
}) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <Row type="flex" align="start" style={{ maxWidth: '400px' }}>
        <Col style={{ flex: 1, fontWeight: 'bold' }}>Username: </Col>
        <Col>{balanceInfo.userName}</Col>
      </Row>
      <Row type="flex" align="start" style={{ maxWidth: '400px' }}>
        <Col style={{ flex: 1, fontWeight: 'bold' }}>Cashier Name: </Col>
        <Col>{balanceInfo.cashierName}</Col>
      </Row>
      <Row type="flex" align="start" style={{ maxWidth: '400px' }}>
        <Col style={{ flex: 1, fontWeight: 'bold' }}>Shift Name: </Col>
        <Col>{balanceInfo.shiftName}</Col>
      </Row>
      <Row type="flex" align="start" style={{ maxWidth: '400px' }}>
        <Col style={{ flex: 1, fontWeight: 'bold' }}>Store Name: </Col>
        <Col>{balanceInfo.storeName}</Col>
      </Row>
      <Row style={{ fontWeight: 'bold' }}>Open-Closed Time: </Row>
      <Row>{moment(balanceInfo.open).format('DD MMM YYYY, HH:mm:ss')} - {moment(balanceInfo.closed).format('DD MMM YYYY, HH:mm:ss')}</Row>
    </div>
  )
}

export default BalanceInfo
