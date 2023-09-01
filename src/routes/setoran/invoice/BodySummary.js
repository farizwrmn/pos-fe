import { Col, Row } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const BodySummary = ({ invoiceSummary }) => {
  const { totalBalanceInput, totalBalancePayment, totalDiffBalance } = invoiceSummary

  return (
    <div className={styles.item}>
      <Row type="flex">
        <Col className={styles.leftItem}>Total Input</Col>
        <Col>{currencyFormatter(totalBalanceInput)}</Col>
      </Row>
      <Row type="flex">
        <Col className={styles.leftItem}>Total Penjualan</Col>
        <Col>{currencyFormatter(totalBalancePayment)}</Col>
      </Row>
      <Row type="flex">
        <Col className={styles.leftItem}>Total Selisih</Col>
        <Col>{currencyFormatter(totalDiffBalance)}</Col>
      </Row>
    </div>
  )
}

export default BodySummary
