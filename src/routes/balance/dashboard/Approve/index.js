import React from 'react'
import { Row, Col } from 'antd'
import ApproveCard from './ApproveCard'
import styles from './index.less'

const Approve = ({
  list,
  onOpenModal
}) => {
  return (
    <div>
      <Row>
        <Col md={24} lg={12}>
          <div className={styles.container}>
            <h1 className={styles.title}>Closing Report</h1>
            {list && list.length > 0 ? list.map(item => (
              <ApproveCard item={item} onOpenModal={onOpenModal} />
            ))
              : (
                <div>
                  <h2>Everything is done, have a good day</h2>
                </div>
              )}
          </div>
        </Col>
        <Col md={24} lg={12} />
      </Row>
    </div>
  )
}

export default Approve
