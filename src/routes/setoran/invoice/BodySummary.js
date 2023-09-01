import { Col, Row } from 'antd'
import styles from './index.less'

const BodySummary = ({ list }) => {
  return (
    <div className={styles.item}>
      <Row type="flex">
        <Col className={styles.leftItem}>Total Input</Col>
        <Col>0</Col>
      </Row>
      <Row type="flex">
        <Col className={styles.leftItem}>Total Penjualan</Col>
        <Col>0</Col>
      </Row>
      <Row type="flex">
        <Col className={styles.leftItem}>Total Selisih</Col>
        <Col>0</Col>
      </Row>
    </div>
  )
}

export default BodySummary
